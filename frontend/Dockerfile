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

# Build arguments for Vite env vars (baked at build time)
ARG VITE_API_BASE_URL=http://localhost:8000
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Convert ARGs to ENVs so Vite can read them via process.env during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Copy package files first (cache optimization)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app (VITE_* env vars are read by Vite during build)
RUN npm run build

# ============================================================
# Stage 2: Serve with Nginx
# ============================================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ > /dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
