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

### Documentation

Pour la documentation, on a utilisé Compodoc (`@compodoc/compodoc`) qui permet de générer une documentation à partir des commentaires de Typescript. On a choisi cet outil car il est très simple d'utilisation et permet de rapidement générer une documentation complète et propre.

Pour générer la documentation, il suffit de lancer la commande suivante :

```sh
cd backend
npm run docs:serve
```
Ensuite, se rendre sur http://127.0.0.1:8889/ pour accéder à la documentation.


### Frontend

Pour le frontend, on a choisi d'utiliser React avec TypeScript car c'était un module vu en cours au S1 en ajoutant TypeScript pour avoir une base de code nettement plus propre et maintenable.

On peut noter l'utilisation de librairies tel que `@tanstack/react-query` qui permettent respectivement de gérer la récupération de données avec un "state" serveur, ou `yup` qui est un validateur de données.

On a gagné beaucoup de temps lors de la création des interfaces (même si pas demandé) en utilisant la librairie de composants `shadcn/ui`. Contrairement aux autres librairies, elle génère les composants directement dans le projet, autorisant ainsi le développeur de les modifier et de les adapter à ses besoins.

### Backend

Pour le backend, on a décidé de composer notre propre framework à partir de différentes librairies disponibles sur internet :

- `fastify` pour le serveur HTTP
- `mikro-orm` pour la gestion de la base de données (avec le module PostgreSQL)
- `typescript` pour continuer dans l'optique de code propre et maintenable
- `vinejs` pour la validation de données
- `@adonisjs/fold` pour avoir un conteneur IoC

### Conteneur IoC ?

Un conteneur IoC (Inversion of Control) est un conteneur capable de gérer les dépendances d'une application. Il a comme responsabilité de créer des instances de classes et de les injecter dans d'autres classes. Cela permet de réduire la complexité de l'application en déléguant la gestion des dépendances à un conteneur.

Par exemple, imaginons une classe `QuizService` qui va manipuler nos quizzes et qui dépends de `CardService`, il suffira de passer `CardService` en paramètre du constructeur de `QuizService` et le conteneur IoC se chargera de créer une instance de `CardService` et de l'injecter dans `QuizService`.
Une autre utilité du conteneur IoC est de pouvoir injecter des classes abstraites. Cela signifie, par exemple que notre classe `QuizService` peut dépendre d'une classe `AbstractCardService` qui servira de contrat et le conteneur se chargera d'instancier une classe implémentant `AbstractCardService` avant de l'injecter dans `QuizService`.

Cette manière de fonctionner, en plus réduire la complexité du code permet également de faciliter les tests unitaires en les inter-changeant avec des test-doubles (ou mocks) de classes. Un autre exemple présent dans le projet est le `FakeAuthService` qui est ici comme "placeholder" pour l'authentification puisque celle-ci n'est pas demandé dans le sujet.

Et bien entendu, tout cela aide fortement à appliquer les principes SOLID et Clean Code puisque cela permet de découpler les classes entre elles et de les rendre plus facilement testable.


### Tests

Pour les tests, on utilise `vitest` avec `supertest`. on a choisi cet outil car il est très simple d'utilisation et possède une très bonne réputation, que cela soit au niveau de sa documentation, sa mise en place (configuration) ou même ses performances.

## Lancer les tests

Deux types de tests sont disponibles sur le projets : test d'intégration pour le backend.

Pour exécuter les tests d'intégration backend, il faut lancer la commande suivante :

```sh
cd backend
docker compose -f docker-compose.test.yml up -d
npm run test
```

### Screenshot

Un dossier `screenshot` est disponible à la racine du projet. Il contient des captures d'écran de l'application.