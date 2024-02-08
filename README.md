# projet-clean-code-leitner


## Installation et lancement du projet

Le projet est répartis en 2 dossier : le client et le serveur.

Pour commencer, il faut tout d'abord lancer le serveur :

```sh
cd backend
# Copie le fichier .env
cp .env.example .env
# Installe les dépendances
npm install
# Démarre de la base de données
docker compose up -d
# Déploiment de la migration
npm run migrate:up
# Démarre le serveur
npm run start
```

Ensuite, il faut lancer le client :

```sh
cd frontend
# Installe les dépendances
npm install
# Démarre le client
npm run dev
```

À partie de maintenant, l'API du serveur devrait être disponible sur http://localhost:8080 et le client sur http://localhost:5173.