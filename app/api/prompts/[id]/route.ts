import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const { data: prompt, error: promptError } = await supabase
      .from("prompts")
      .select(
        `
        *,
        likes(count),
        comments(
          id,
          created_at,
          content,
          user_id
        )
      `
      )
      .eq("id", id)
      .single();

    if (promptError) {
      throw promptError;
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const likesCount = prompt.likes?.[0]?.count || 0;

    const responseData = {
      ...prompt,
      likes_count: likesCount,
      comments: prompt.comments || [],
    };

    return NextResponse.json({ data: responseData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
