
### BUILD ###
# image de départ
FROM alpine:3.20 AS builder
# chemin de travail
WORKDIR ./app
# installation des paquets système

RUN apk update && apk add --no-cache nodejs npm

# ajout utilisateur node et groupe node
RUN addgroup -S node && adduser -S node -G node

# copie des fichiers du dépôt
COPY . .
# installation des dépendances avec npm
RUN npm ci


# build avec npm
RUN npm run build

# downgrade des privilèges
USER node


###RUN ###
FROM alpine:3.20 AS runner

# Chemin de travail
WORKDIR /app

# Installation de Node.js runtime
RUN apk add --no-cache nodejs

# Création de l'utilisateur et groupe node
RUN addgroup -S node && adduser -S node -G node


# Copie uniquement des fichiers nécessaires depuis builder
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package*.json ./

# Installation des dépendances de production uniquement
RUN apk add --no-cache npm && \
    npm ci --only=production && \
    npm cache clean --force && \
    apk del npm && \
    rm -rf /tmp/*

# Downgrade des privilèges
USER node

# exposition du port
EXPOSE 8000
# exécution
CMD ["node", "dist/index.js"]