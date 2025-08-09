# Stage 1: Build app
FROM node:22-alpine AS builder

WORKDIR /app

# Cài deps dựa trên lockfile
COPY package*.json ./
RUN npm ci

# Copy toàn bộ source để build (TS, next.config.ts, public, src, v.v.)
COPY . .

# Tắt telemetry cho build
ENV NEXT_TELEMETRY_DISABLED=1

# Build production
RUN npm run build

# Stage 2: Run app (production)
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Chỉ copy những gì cần để chạy
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy build output & assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Dự án của bạn dùng next.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts
# (tùy vào Next.js version, file next-env.d.ts không cần khi chạy prod server)

EXPOSE 3000
CMD ["npm", "run", "start"]
