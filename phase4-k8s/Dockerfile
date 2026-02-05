# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# to install dependencies
COPY ../phase3-chatbot/package.json ./
COPY ../phase3-chatbot/package-lock.json ./
# If using yarn, uncomment the line below and comment out package-lock.json
# COPY ../phase3-chatbot/yarn.lock ./

RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY ../phase3-chatbot/ ./

# Build the Next.js application for production
RUN npm run build

# Stage 2: Run the Next.js application
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy necessary files from the builder stage
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public/ ./public/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
# If you have other configuration files at the root level, copy them too.
# For example, if you have a tsconfig.json that is used at runtime (unlikely for built app)

# Expose the port the Next.js app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]