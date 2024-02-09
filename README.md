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

### Tests

Pour les tests, on utilise `vitest` avec `supertest`. on a choisi cet outil car il est très simple d'utilisation et possède une très bonne réputation, que cela soit au niveau de sa documentation, sa mise en place (configuration) ou même ses performances.

### Documentation

Pour la documentation, on a utilisé Compodoc (`@compodoc/compodoc`) qui permet de générer une documentation à partir des commentaires de Typescript. On a choisi cet outil car il est très simple d'utilisation et permet de rapidement générer une documentation complète et propre.

## Lancer les tests

Deux types de tests sont disponibles sur le projets : test d'intégration pour le backend.

Pour exécuter les tests d'intégration backend, il faut lancer la commande suivante :

```sh
cd backend
docker compose -f docker-compose.test.yml up -d
npm run test
```