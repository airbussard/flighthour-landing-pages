# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Kopiere package.json und installiere Dependencies
COPY package*.json ./
RUN npm ci

# Kopiere den Rest der Anwendung
COPY . .

# Build der Next.js Anwendung
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Erstelle einen non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Kopiere nur die notwendigen Dateien vom Builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Setze die Berechtigungen
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose Port
EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

# Starte die Anwendung
CMD ["node", "server.js"]