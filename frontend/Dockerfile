# ============================================================
# Multi-Stage Build: Temuin Frontend (React + Vite + Nginx)
# ============================================================
# Stage 1: Build - npm ci + vite build
# Stage 2: Serve - nginx:alpine serves static files
# ============================================================

# ============================================================
# Stage 1: Build
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Build argument for Vite env var
ARG VITE_API_BASE_URL=

# Convert ARG to ENV so Vite can read it via process.env during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files first (cache optimization)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app (VITE_* env vars are read by Vite during build)
RUN npm run build

# ============================================================
# Stage 2: Serve with Nginx (non-root, DEC-018 / DO-8.1)
# ============================================================
# nginxinc/nginx-unprivileged jalan sebagai uid 101 dan listen di
# 8080 (non-privileged port). Build-time file setup butuh root,
# lalu container runtime balik ke uid 101.
FROM nginxinc/nginx-unprivileged:alpine

# Switch ke root hanya untuk setup file saat build
USER root

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Security: runtime sebagai non-root nginx user (uid 101)
USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/ > /dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
