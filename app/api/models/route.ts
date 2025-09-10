import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  try {
    // First try to get enum values using RPC function (if it exists)
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_model_types"
    );

    if (!rpcError && rpcData && rpcData.length > 0) {
      return NextResponse.json({ data: rpcData });
    }

    // If RPC doesn't work, try to get unique model values from existing prompts
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .select("model")
      .not("model", "is", null);

    if (promptError) {
      throw promptError;
    }

    // Extract unique model values
    const uniqueModels = [...new Set(promptData.map((p) => p.model))]
      .filter(Boolean)
      .sort();

    // If we have existing models, return them
    if (uniqueModels.length > 0) {
      return NextResponse.json({ data: uniqueModels });
    }

    // If no models found in database, return fallback list
    throw new Error("No models found in database");
  } catch (error) {
    console.error("Error fetching model types:", error);

    // Return hardcoded fallback if database query fails
    const fallbackModels = [
      "NAI Diffusion Anime V3",
      "NAI Diffusion V4 Curated",
      "NAI Diffusion V4 Full",
      "NAI Diffusion V4.5 Curated",
      "NAI Diffusion V4.5 Full",
    ];

    return NextResponse.json({ data: fallbackModels });
  }
}
