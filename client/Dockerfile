# Utiliser une image Node.js comme base
FROM node:22-bullseye

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer le mode développement avec HTTPS
CMD ["npm", "run", "dev"]