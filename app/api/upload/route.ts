import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { R2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();
    const Key = `${randomUUID()}-${filename}`;

    const signedUrl = await getSignedUrl(
      R2,
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key,
        ContentType: contentType,
      }),
      { expiresIn: 3600 }
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${Key}`;

    return NextResponse.json({ url: signedUrl, publicUrl: publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating presigned URL" },
      { status: 500 }
    );
  }
}
