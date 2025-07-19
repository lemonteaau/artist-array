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

  const supabase = await createClient();

  try {
    // Get current user for like status
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const [promptsResult, likesResult, userLikesResult] = await Promise.all([
      supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("likes").select("prompt_id"),
      user
        ? supabase.from("likes").select("prompt_id").eq("user_id", user.id)
        : Promise.resolve({ data: [] }),
    ]);

    if (promptsResult.error || likesResult.error) {
      throw promptsResult.error || likesResult.error;
    }

    const prompts = promptsResult.data || [];
    const likes = likesResult.data || [];
    const userLikes = userLikesResult.data || [];

    const likesCountMap = likes.reduce((acc, like) => {
      acc[like.prompt_id] = (acc[like.prompt_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const userLikesSet = new Set(userLikes.map((like) => like.prompt_id));

    const promptsWithLikes = prompts.map((prompt) => ({
      ...prompt,
      likes_count: likesCountMap[prompt.id] || 0,
      user_liked: userLikesSet.has(prompt.id),
    }));

    // Sort by popularity if requested
    let finalData = promptsWithLikes;
    if (sort === "popular") {
      finalData = promptsWithLikes.sort(
        (a, b) => b.likes_count - a.likes_count
      );
    }

    return NextResponse.json({ data: finalData });
  } catch (error) {
    console.error("Error in GET /api/prompts:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
