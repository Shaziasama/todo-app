# Multi-stage build for Next.js application
FROM node:18-alpine AS builder

WORKDIR /app
COPY ../phase3-chatbot/package*.json ./
RUN npm ci --only=production

COPY ../phase3-chatbot/. .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package.json and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
RUN chown -R nextjs:nodejs /app
USER nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/. .

EXPOSE 3000

CMD ["npm", "start"]