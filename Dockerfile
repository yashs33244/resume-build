# Build stage
FROM --platform=linux/arm64 node:18-alpine AS builder

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    cairo \
    pango

# Set Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

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
FROM --platform=linux/arm64 node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    cairo \
    pango

# Set Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app /app

RUN npm install -g pnpm

EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
