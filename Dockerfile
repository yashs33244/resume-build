# Build stage
FROM node:18-alpine AS builder

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Generate Prisma client
RUN cd packages/db && pnpm prisma generate

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

EXPOSE 3000

# Start the application
CMD ["pnpm", "start", "--filter", "apps/docs"]