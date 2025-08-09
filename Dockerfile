# Stage 1: Build app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Nếu dùng biến public, set qua .env.production hoặc ENV ở đây
RUN npm run build

# Stage 2: Run app
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
ENV PORT=3000
CMD ["npm","run","start"]