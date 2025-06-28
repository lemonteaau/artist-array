import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // Get the prompt data
    const { data: prompt, error: promptError } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .single();

    if (promptError) {
      if (promptError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Prompt not found" },
          { status: 404 }
        );
      }
      throw promptError;
    }

    // Get likes count
    const { count: likesCount } = await supabase
      .from("likes")
      .select("*", { count: "exact" })
      .eq("prompt_id", id);

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("id, created_at, content, user_id")
      .eq("prompt_id", id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      throw commentsError;
    }

    // Transform the data
    const transformedData = {
      ...prompt,
      likes_count: likesCount || 0,
      comments: comments || [],
    };

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error("Error in GET /api/prompts/[id]:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    // First check if the prompt exists and belongs to the user
    const { data: prompt, error: fetchError } = await supabase
      .from("prompts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Prompt not found" },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    if (prompt.user_id !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own prompts" },
        { status: 403 }
      );
    }

    // Delete the prompt (this will cascade delete likes and comments due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from("prompts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Extra safety check

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/prompts/[id]:", error);
    return NextResponse.json(
      { error: "Error deleting prompt" },
      { status: 500 }
    );
  }
}
