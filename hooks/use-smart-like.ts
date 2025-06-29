import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

interface UseSmartLikeProps {
  promptId: string;
  userId: string | null;
  onAuthRequired: () => void;
}

interface LikeState {
  liked: boolean;
  count: number;
  isLoading: boolean;
}

export function useSmartLike({
  promptId,
  userId,
  onAuthRequired,
}: UseSmartLikeProps) {
  const [state, setState] = useState<LikeState>({
    liked: false,
    count: 0,
    isLoading: false,
  });

  const serverStateRef = useRef<{ liked: boolean; count: number }>({
    liked: false,
    count: 0,
  });
  const pendingOperationsRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchInitialState = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch(`/api/likes?prompt_id=${promptId}`);
      if (response.ok) {
        const { liked, count } = await response.json();
        const newState = { liked, count };

        serverStateRef.current = newState;
        setState({ ...newState, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch like status:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [promptId]);

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (!userId || pendingOperationsRef.current === 0) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt_id: parseInt(promptId) }),
        signal: controller.signal,
      });

      if (response.ok) {
        const { liked: serverLiked, count: serverCount } =
          await response.json();

        serverStateRef.current = { liked: serverLiked, count: serverCount };

        const finalLiked =
          pendingOperationsRef.current % 2 === 0 ? serverLiked : !serverLiked;
        const finalCount = Math.max(
          0,
          serverCount + pendingOperationsRef.current
        );

        setState({
          liked: finalLiked,
          count: finalCount,
          isLoading: false,
        });

        pendingOperationsRef.current = 0;
      } else {
        throw new Error("Failed to update like");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Like API error:", error);

      setState({
        ...serverStateRef.current,
        isLoading: false,
      });
      pendingOperationsRef.current = 0;

      toast.error("Failed to update like. Please try again.");
    }
  }, 500);

  const toggleLike = useCallback(() => {
    if (!userId) {
      onAuthRequired();
      return;
    }

    setState((prev) => {
      const newLiked = !prev.liked;
      const countChange = newLiked ? 1 : -1;
      const newCount = Math.max(0, prev.count + countChange);

      return {
        liked: newLiked,
        count: newCount,
        isLoading: prev.isLoading,
      };
    });

    pendingOperationsRef.current += state.liked ? -1 : 1;

    debouncedApiCall();
  }, [userId, state.liked, onAuthRequired, debouncedApiCall]);

  useEffect(() => {
    fetchInitialState();
  }, [fetchInitialState]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedApiCall.cancel();
    };
  }, [debouncedApiCall]);

  return {
    liked: state.liked,
    count: state.count,
    isLoading: state.isLoading,
    toggleLike,
    refetch: fetchInitialState,
  };
}
