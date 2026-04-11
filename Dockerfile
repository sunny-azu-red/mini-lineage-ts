# --- STAGE 1: The Kitchen (Builder) ---
FROM node:20-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .
RUN git config --global --add safe.directory /app
RUN npm run build

# --- STAGE 2: The App (Production) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["sh", "-c", "node dist/scripts/db/migrate.js && npm start"]
