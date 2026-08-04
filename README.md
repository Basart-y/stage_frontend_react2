# Plateforme de gestion de points relais

Application Next.js regroupant le frontend et les routes API pour gérer un réseau de points relais : comptes par rôle, livraisons, réception, remise, retours, signalements, notifications, traçabilité et finance.

## Rôles

- Super gestionnaire
- Gestionnaire
- Commerçant
- Point relais
- Gestionnaire financier

Les points relais sont des utilisateurs ayant `role: "point_relais"`. Leurs données métier sont conservées dans l'objet `profile` du document utilisateur.

## Fonctionnalités principales

- Portails de connexion séparés et contrôle des rôles côté serveur.
- Création et suivi des livraisons avec machine à états.
- Fiches détaillées de réception et de remise.
- Refus, retour, historique et signalements.
- Recherche des points relais, carte OpenStreetMap et géocodage depuis l'adresse.
- Pagination et filtres des principales listes.
- Notifications persistées, WebSocket et préparation Web Push.
- Factures commerçants et bons de paiement des points relais.
- Traces d'audit, logs JSON avec `requestId` et documentation OpenAPI.

## Installation locale

Prérequis : Node.js compatible avec Next.js et MongoDB local ou MongoDB Atlas.

```powershell
Copy-Item .env.example .env.local
npm ci
npm run auth:seed -- admin@test.fr "ChoisirUnMotDePasseFort"
npm run dev:next
```

Ouvrir `http://localhost:3000`.

Ne jamais versionner `.env.local`. Le ZIP livré ne contient volontairement aucun secret.

## Variables d'environnement

Les variables essentielles sont :

```env
MONGODB_URI=
MONGODB_DB=relayflow
JWT_SECRET=
CRON_SECRET=
BCRYPT_ROUNDS=12
PICKUP_DEADLINE_DAYS=7
ENABLE_INTERNAL_SCHEDULER=false
```

Les variables SMTP et VAPID sont nécessaires uniquement pour tester les invitations email et Web Push réels. Voir `.env.example` et `docs/DEPLOIEMENT_SECURITE_RECETTE.md`.

## Commandes

```powershell
npm run test       # tests unitaires
npm run test:cr    # conformité structurelle CR et sécurité
npm run test:all   # ensemble des tests
npm run lint
npm run build
npm run dev:next
```

## État validé

- Tests métier initiaux : 5/5 réussis.
- Tests de limitation de connexion ajoutés.
- Build Next.js de production validé.
- MongoDB Atlas et déploiement Vercel testés.
- OpenAPI disponible dans `openapi.yaml`.

## Sécurité intégrée

- Mots de passe hachés avec bcrypt.
- JWT signés et expirant après 15 minutes.
- Contrôle du rôle, du statut et du périmètre côté serveur.
- Limitation des tentatives de connexion avec réponse HTTP `429`.
- En-têtes HTTP de sécurité, CSP, HSTS et protection anti-framing.
- Logs de connexion anonymisés : aucun email ou mot de passe en clair.
- Ancienne route publique de points relais fictifs supprimée.

Pour une vraie exploitation publique, utiliser un utilisateur MongoDB limité à la base `relayflow`, changer les comptes de démonstration et effectuer la recette complète décrite dans le guide de déploiement.
