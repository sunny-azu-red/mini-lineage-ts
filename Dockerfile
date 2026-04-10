# Use Node 20
FROM node:20-alpine

# 1. Install git (required for your build script)
RUN apk add --no-cache git

# 2. Set working directory
WORKDIR /app

# 3. FIX: Tell Git to trust this directory (fixes Exit Code 128)
RUN git config --global --add safe.directory /app

# 4. Install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# 5. Copy the rest of the files
# Portainer clones the repo including the .git folder, so this copies it over
COPY . .

# 6. Run the build script
# This will now successfully run: git rev-parse --short HEAD > dist/version.txt
RUN npm run build

# 7. Expose the app port
EXPOSE 3000

# 8. Start: Run migrations, then start server
# We use sh -c to chain the commands
CMD ["sh", "-c", "npm run db:migrate && npm start"]
