# Build stage
FROM node:18-alpine AS builder

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
    pango \
    openssl

# Set Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy the entire project
COPY . .
# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

RUN cd packages/db && pnpm prisma generate

# Build the application
RUN cd apps/docs && pnpm run build

# Production stage
FROM node:18-alpine

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
    pango \
    openssl

# Set Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app /app

RUN npm install -g pnpm

EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]