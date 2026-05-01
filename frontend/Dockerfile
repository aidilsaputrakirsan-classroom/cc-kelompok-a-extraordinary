# ============================================================
# Stage 1: Build - Install deps & build React app
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for Docker layer caching.
COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

# This value is embedded into the Vite production bundle.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ============================================================
# Stage 2: Production - Serve static files with Nginx
# ============================================================
FROM nginx:alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
