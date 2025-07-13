"use client";

interface CloudflareLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareLoader({
  src,
  width,
  quality,
}: CloudflareLoaderParams): string {
  if (!quality) {
    quality = 75;
  }

  const r2PublicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL!;

  const imageUrl = new URL(src);

  const imagePath = imageUrl.pathname;

  return `${r2PublicUrl}/cdn-cgi/image/width=${width},quality=${quality},format=auto${imagePath}`;
}
