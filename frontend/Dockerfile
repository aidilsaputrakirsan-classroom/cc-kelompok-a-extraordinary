# ============================================================
# Stage 1: Build — Install deps & build React app
# ============================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files dulu (cache optimization)
COPY package.json package-lock.json* ./

# Install dependencies
# npm ci = clean install (lebih cepat & reproducible dari npm install)
RUN npm ci

# Copy source code
COPY . .

# Set API URL untuk production build
# Ini akan di-embed ke dalam bundle JavaScript
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Build React app → output di /app/dist/
RUN npm run build

# ============================================================
# Stage 2: Production — Serve dengan Nginx
# ============================================================
FROM nginx:alpine

# Copy build output dari stage 1
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx default port
EXPOSE 80

# Nginx berjalan di foreground
CMD ["nginx", "-g", "daemon off;"]