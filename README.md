
## 🛠️ Installation

Get up and running with these simple steps:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd find-it-here

2. **Install pnpm globally**
    ```bash
    npm install -g pnpm
3. **Install dependencies**
    ```bash
    pnpm install
4. **Set up environment variables**    
    ```bash
    cp apps/docs/.env.example apps/docs/.env
    cp packages/db/.env.example packages/db/.env
5. **Start PostgreSQL with Docker Ensure Docker is installed, then run:**
    ```bash
    docker run -d \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -e POSTGRES_DB=find-it-here \
    -p 5432:5432 \
    --name find-it-here-db \
    postgres
7. **Generate Prisma Client and run migrations**
    ```bash
    cd packages/db
    pnpm prisma generate
    pnpm prisma migrate dev
8. **Start the development server**
    ```bash
    cd ../..
    pnpm dev
    