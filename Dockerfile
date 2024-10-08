ARG NODE_VERSION=22.3.0
ARG PNPM_VERSION=9.7.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile 

# Build stage
FROM base AS build
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml drizzle.config.ts ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY --chown=node:node . .
RUN pnpm run build 

# Production code generation stage
FROM base AS prod-codegen

WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app ./
RUN rm -f sqlite.db && pnpm drizzle-kit generate && pnpm drizzle-kit migrate

# Development final stage
FROM base AS final-dev
WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./
EXPOSE ${PORT}
CMD ["pnpm", "start:dev"]

# Production final stage
FROM base AS final-prod
WORKDIR /usr/src/app
# Use --chown on COPY commands to set file permissions
USER node

COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=node:node /usr/src/app/package.json ./
COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --from=build --chown=node:node /usr/src/app/drizzle ./drizzle
COPY --from=prod-codegen --chown=node:node /usr/src/app/*.db ./


USER root
RUN apk del --purge libc6-compat && rm -rf /var/cache/apk/* /tmp/* /usr/src/app/.pnpm-store

# Switch back to node user
USER node
CMD ["pnpm", "start:prod"]
