FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
COPY . .

RUN pnpm install -r --offline --frozen-lockfile

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=$NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["pnpm", "start"]