export const AI_MODELS = [
  "Stable Diffusion XL",
  "Midjourney",
  "DALL-E 3",
  "DALL-E 2",
  "Stable Diffusion 1.5",
  "Stable Diffusion 2.1",
  "Leonardo AI",
  "Firefly",
  "Playground AI",
  "RunwayML",
  "Imagen",
  "NovelAI",
  "Waifu Diffusion",
  "Other",
] as const;

export type AIModel = (typeof AI_MODELS)[number];
