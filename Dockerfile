# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy root package.json, pnpm-lock.yaml, and turborepo configuration
COPY package.json pnpm-lock.yaml turbo.json ./

# Copy the apps and packages directories
COPY apps ./apps
COPY packages ./packages

# Install pnpm
RUN npm install -g pnpm

# Install dependencies for all workspaces
RUN pnpm install -r

# Build the application
RUN pnpm run build --filter=docs

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["sh", "-c", "cd /app && pnpm run prisma:docker && cd /app/apps/docs && pnpm start"]