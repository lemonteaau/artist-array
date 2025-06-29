import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { prompt_id } = await request.json();

  if (!prompt_id) {
    return NextResponse.json(
      { error: "prompt_id is required" },
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
    // Check if like already exists
    const { data: existingLike } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("prompt_id", prompt_id)
      .single();

    if (existingLike) {
      // Unlike - remove the like
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("prompt_id", prompt_id);

      if (error) {
        throw error;
      }

      // Get updated count after unlike
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("prompt_id", prompt_id);

      return NextResponse.json({
        liked: false,
        count: count || 0,
        message: "Like removed",
      });
    } else {
      // Like - add the like
      const { error } = await supabase.from("likes").insert([
        {
          user_id: user.id,
          prompt_id: prompt_id,
        },
      ]);

      if (error) {
        throw error;
      }

      // Get updated count after like
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("prompt_id", prompt_id);

      return NextResponse.json({
        liked: true,
        count: count || 0,
        message: "Like added",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing like" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt_id = searchParams.get("prompt_id");

  if (!prompt_id) {
    return NextResponse.json(
      { error: "prompt_id is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    // Check if user has liked this prompt
    let userLiked = false;
    if (user) {
      const { data: existingLike } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("prompt_id", prompt_id)
        .single();

      userLiked = !!existingLike;
    }

    // Get total likes count
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact" })
      .eq("prompt_id", prompt_id);

    return NextResponse.json({
      liked: userLiked,
      count: count || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching like status" },
      { status: 500 }
    );
  }
}
