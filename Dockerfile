# Build stage
FROM node:18-alpine AS builder

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy the entire project
COPY . .

RUN npm install -g pnpm
RUN pnpm install

# Build the application
RUN cd apps/docs && pnpm run build

# Production stage
FROM node:18-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app /app

RUN npm install -g pnpm

RUN chmod +x /app/start.sh

EXPOSE 3000

# Use the startup script as the entrypoint
CMD ["/app/start.sh"]