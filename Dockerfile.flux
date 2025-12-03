# Dockerfile pour le service Check Flux
FROM node:20-alpine AS build

WORKDIR /app

# Copier les dépendances
COPY package*.json ./
RUN npm ci

# Copier le code source
COPY . .

# Build uniquement pour le flux
ENV VITE_APP_NAME="Check Flux"
RUN npm run build

# Stage de production avec nginx
FROM nginx:alpine

# Copier le build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration nginx pour SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

