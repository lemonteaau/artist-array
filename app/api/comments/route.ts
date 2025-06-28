import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { prompt_id, content } = await request.json();

  if (!prompt_id || !content) {
    return NextResponse.json(
      { error: "prompt_id and content are required" },
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
      .from("comments")
      .insert([
        {
          prompt_id,
          content,
          user_id: user.id,
        },
      ])
      .select(
        `
        *,
        users:user_id (
          email
        )
      `
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error adding comment" },
      { status: 500 }
    );
  }
}
