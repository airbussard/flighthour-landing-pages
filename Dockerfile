# Build stage
FROM node:18-alpine3.17 AS builder
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/admin/package*.json ./apps/admin/
COPY apps/partner/package*.json ./apps/partner/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/database/package*.json ./packages/database/
COPY packages/auth/package*.json ./packages/auth/
COPY packages/payments/package*.json ./packages/payments/
COPY packages/consent/package*.json ./packages/consent/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build all apps
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Accept build arguments for sensitive values
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables from build args (with defaults for local builds)
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-https://placeholder.supabase.co}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-placeholder}

RUN npm run build

# Runner stage for web app
FROM node:18-alpine3.17 AS runner
RUN apk add --no-cache openssl1.1-compat
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder if it exists
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the web app
CMD ["node", "apps/web/server.js"]