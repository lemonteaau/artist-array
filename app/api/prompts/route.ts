import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { artist_string, image_url, prompt, negative_prompt, model } =
    await request.json();

  if (!artist_string || !image_url || !model) {
    return NextResponse.json(
      { error: "artist_string, image_url and model are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("prompts")
      .insert([
        {
          artist_string,
          image_url,
          prompt,
          negative_prompt,
          model,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/prompts:", error);
    return NextResponse.json(
      { error: "Error inserting data" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "newest";
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  const supabase = await createClient();

  try {
    // Get current user for like status
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (sort === "popular") {
      const { data: topPrompts, error: topPromptsError } = await supabase.rpc(
        "get_popular_prompts",
        {
          limit_count: limit,
          offset_count: offset,
        }
      );

      if (topPromptsError) {
        console.warn("RPC error details:", topPromptsError);
        console.warn("RPC not available, falling back to client-side sorting");
        const { data: allPrompts, error: allPromptsError } = await supabase
          .from("prompts")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, Math.min(1000, limit * 10) - 1);

        if (allPromptsError || !allPrompts) {
          throw allPromptsError;
        }

        const promptIds = allPrompts.map((p) => p.id);
        const [likesResult, userLikesResult] = await Promise.all([
          supabase.from("likes").select("prompt_id").in("prompt_id", promptIds),
          user
            ? supabase
                .from("likes")
                .select("prompt_id")
                .eq("user_id", user.id)
                .in("prompt_id", promptIds)
            : Promise.resolve({ data: [] }),
        ]);

        const likes = likesResult.data || [];
        const userLikes = userLikesResult.data || [];

        const likesCountMap = likes.reduce((acc, like) => {
          acc[like.prompt_id] = (acc[like.prompt_id] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const userLikesSet = new Set(userLikes.map((like) => like.prompt_id));

        const sortedPrompts = allPrompts
          .map((prompt) => ({
            ...prompt,
            likes_count: likesCountMap[prompt.id] || 0,
            user_liked: userLikesSet.has(prompt.id),
          }))
          .sort((a, b) => b.likes_count - a.likes_count)
          .slice(offset, offset + limit);

        return NextResponse.json({ data: sortedPrompts });
      }

      if (user) {
        const promptIds = topPrompts.map((p: { id: number }) => p.id);
        const { data: userLikes } = await supabase
          .from("likes")
          .select("prompt_id")
          .eq("user_id", user.id)
          .in("prompt_id", promptIds);

        const userLikesSet = new Set(
          userLikes?.map((like) => like.prompt_id) || []
        );

        const finalData = topPrompts.map(
          (prompt: { id: number; likes_count: number }) => ({
            ...prompt,
            user_liked: userLikesSet.has(prompt.id),
          })
        );

        return NextResponse.json({ data: finalData });
      }

      const finalDataForGuests = topPrompts.map(
        (prompt: { id: number; likes_count: number }) => ({
          ...prompt,
          user_liked: false,
        })
      );

      return NextResponse.json({ data: finalDataForGuests });
    } else {
      const { data: prompts, error: promptsError } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (promptsError || !prompts) {
        throw promptsError;
      }

      const promptIds = prompts.map((p) => p.id);
      const [likesResult, userLikesResult] = await Promise.all([
        supabase.from("likes").select("prompt_id").in("prompt_id", promptIds),
        user
          ? supabase
              .from("likes")
              .select("prompt_id")
              .eq("user_id", user.id)
              .in("prompt_id", promptIds)
          : Promise.resolve({ data: [] }),
      ]);

      const likes = likesResult.data || [];
      const userLikes = userLikesResult.data || [];

      const likesCountMap = likes.reduce((acc, like) => {
        acc[like.prompt_id] = (acc[like.prompt_id] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const userLikesSet = new Set(userLikes.map((like) => like.prompt_id));

      const finalData = prompts.map((prompt) => ({
        ...prompt,
        likes_count: likesCountMap[prompt.id] || 0,
        user_liked: userLikesSet.has(prompt.id),
      }));

      return NextResponse.json({ data: finalData });
    }
  } catch (error) {
    console.error("Error in GET /api/prompts:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
