FROM node:20-alpine AS builder

# Install dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl-dev python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma/schema.prisma ./
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime stage
FROM node:20-alpine AS runtime

# Install only runtime dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package.json and built application
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/seed.ts ./seed.ts

# Generate Prisma client again in runtime image
RUN npx prisma generate

# Make entrypoint script executable and copy it
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 7860

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"
ENV NEXTAUTH_URL="https://localhost:7860"

# Start the application
CMD ["sh", "-c", "./entrypoint.sh"]