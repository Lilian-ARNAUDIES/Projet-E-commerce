# Utilise une image Node.js
FROM node:22-bullseye

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Exposer le port 8000
EXPOSE 8000

# Commande pour démarrer le serveur avec HTTPS
CMD ["npm", "run", "dev"]