# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Arguments de build pour les variables d'environnement
ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Créer le fichier .env avec les arguments
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env && \
    echo "VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}" >> .env

# Build de production
RUN npm run build

# Stage 2: Production avec Nginx
FROM nginx:alpine

# Installer curl pour le health check
RUN apk add --no-cache curl

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis le stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Ajouter un script pour injecter les variables d'environnement au runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exposer le port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Utiliser le script d'entrée personnalisé
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]