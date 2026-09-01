# Stage 1: Build static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests first for optimal Docker layer caching
COPY package.json package-lock.json* bun.lock* ./

RUN npm ci

# Copy source code and config files
COPY . .

# Compile TypeScript and bundle with Vite
RUN npm run build

# Stage 2: Serve with hardened, non-root Nginx
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Custom Nginx configuration with SPA client-side routing fallback and security headers
COPY --chown=nginx:nginx <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Static Assets Cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Copy compiled assets from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080

USER 101

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
