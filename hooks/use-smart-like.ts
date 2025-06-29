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

  const targetLikedRef = useRef<boolean | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchInitialState = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch(`/api/likes?prompt_id=${promptId}`);
      if (response.ok) {
        const { liked, count } = await response.json();

        serverStateRef.current = { liked, count };
        targetLikedRef.current = null;
        setState({ liked, count, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch like status:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [promptId]);

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (!userId || targetLikedRef.current === null) return;

    if (targetLikedRef.current === serverStateRef.current.liked) {
      targetLikedRef.current = null;
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

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
        const { liked, count } = await response.json();

        serverStateRef.current = { liked, count };

        if (
          targetLikedRef.current !== null &&
          targetLikedRef.current !== liked
        ) {
          const finalCount = targetLikedRef.current
            ? count + 1
            : Math.max(0, count - 1);

          setState({
            liked: targetLikedRef.current,
            count: finalCount,
            isLoading: false,
          });

          debouncedApiCall();
        } else {
          targetLikedRef.current = null;
          setState({
            liked,
            count,
            isLoading: false,
          });
        }
      } else {
        throw new Error("Failed to update like");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Like API error:", error);

      targetLikedRef.current = null;
      setState({
        ...serverStateRef.current,
        isLoading: false,
      });

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
      targetLikedRef.current = newLiked;

      const newCount = newLiked ? prev.count + 1 : Math.max(0, prev.count - 1);

      return {
        liked: newLiked,
        count: newCount,
        isLoading: prev.isLoading,
      };
    });

    debouncedApiCall();
  }, [userId, onAuthRequired, debouncedApiCall]);

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
