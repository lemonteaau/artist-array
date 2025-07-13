FROM node:18-alpine AS builder


RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm fetch

RUN pnpm install --prod --no-frozen-lockfile

COPY . .

RUN pnpm build

FROM node:18-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]