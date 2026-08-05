# Mise en œuvre du guide déploiement, logs et tests

## Déploiement
- Projet Next.js frontend/backend unique, compatible Vercel.
- `vercel.json` configure le build et une tâche Cron quotidienne pour les colis non récupérés.
- Les secrets restent dans les variables d'environnement (`.env.example` sert de modèle).
- GitHub Actions exécute installation propre, lint, tests et build sur les pull requests et `main`.
- La base MongoDB doit être hébergée séparément, par exemple sur MongoDB Atlas.

## Tests
- Tests automatisés natifs Node pour la machine à états et le confinement géographique.
- Scripts : `npm test`, `npm run test:cr`, `npm run test:all`.
- Les tests API existants restent disponibles avec `npm run test:api` et nécessitent une application lancée et une base de test.
- Les parcours navigateur critiques à automatiser ensuite : création de livraison, réception, remise, refus et signalement.

## Logs et erreurs
- `middleware.js` génère et propage `x-request-id` pour chaque requête API.
- `lib/backend/logger.js` écrit un objet JSON par ligne avec `ts`, `level`, `requestId`, `msg` et `ctx`.
- Aucun email, téléphone ou adresse ne doit être placé dans `ctx`.
- Les réponses API utilisent une enveloppe stable avec `error.code`, `error.message` et `error.requestId`.

## Contrat d'API
- `openapi.yaml` documente les premières routes critiques et doit être complété au fil des routes.

## Variables Vercel minimales
- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- Variables SMTP si les invitations par email sont activées.
- Variables VAPID si les notifications Web Push sont activées.
