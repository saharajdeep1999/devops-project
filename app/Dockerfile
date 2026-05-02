# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY index.js .

# Change ownership and drop privileges
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["node", "index.js"]