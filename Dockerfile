FROM node:24-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# hadolint ignore=DL3018
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# Disable husky
RUN npm pkg delete scripts.prepare
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build && npm prune --omit=dev

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG USER_GID=1001
ARG USER_UID=1001
RUN getent group ${USER_GID} || addgroup --system --gid ${USER_GID} nodejs
RUN getent passwd ${USER_UID} || adduser --system --uid ${USER_UID} nextjs

COPY --from=builder /app/public ./public
RUN mkdir -p .next/cache && chown -R ${USER_UID}:${USER_GID} .next && chmod -R 777 .next/cache

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=${USER_UID}:${USER_GID} /app/.next/standalone ./
COPY --from=builder --chown=${USER_UID}:${USER_GID} /app/.next/static ./.next/static
RUN rm -f .env

USER nextjs
EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
