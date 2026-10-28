
# Stage 1: Install dependencies and generate Prisma Client
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

# Prisma 7 config reads DATABASE_URL.
# This placeholder is used only during image generation.
RUN DATABASE_URL="postgresql://appuser:buildonly@localhost:5432/appdb" \
    npx prisma generate

COPY src ./src

# Keep Prisma CLI in production dependencies for migrations.
RUN npm prune --omit=dev

# Stage 2: Production runtime
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/prisma.config.ts ./prisma.config.ts

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
