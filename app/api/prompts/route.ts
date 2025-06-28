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
    // Get all prompts
    let promptsQuery = supabase.from("prompts").select("*");

    if (sort === "newest") {
      promptsQuery = promptsQuery.order("created_at", { ascending: false });
    }

    const { data: prompts, error: promptsError } = await promptsQuery;

    if (promptsError) {
      throw promptsError;
    }

    // Get likes count for each prompt
    const promptsWithLikes = await Promise.all(
      prompts.map(async (prompt) => {
        const { count } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("prompt_id", prompt.id);

        return {
          ...prompt,
          likes_count: count || 0,
        };
      })
    );

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
