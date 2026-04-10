# Use a lightweight Node.js 20 image
FROM node:20-alpine

# The build script in your package.json requires git
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy package files and install ALL dependencies (including dev for ts-node)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (runs your custom tsc, minification, and git versioning)
RUN npm run build

# Expose the port
EXPOSE 3000

# The startup command: run migrations, then start the server
CMD ["sh", "-c", "npm run db:migrate && npm start"]
