# Déploiement, sécurité et recette

## MongoDB Atlas

1. Créer un utilisateur MongoDB dédié à l'application.
2. Lui attribuer uniquement la lecture/écriture sur la base `relayflow` ; ne pas utiliser `atlasAdmin`.
3. Utiliser un mot de passe long et unique.
4. Pour Vercel avec IP dynamiques, Atlas doit accepter `0.0.0.0/0`. Cette ouverture rend indispensable le principe du moindre privilège et un mot de passe robuste.
5. Placer la chaîne Atlas dans `MONGODB_URI` sur Vercel, jamais dans GitHub.

## Vercel

Configurer au minimum pour Preview et Production :

- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `CRON_SECRET`
- `MERCHANT_MONTHLY_PRICE`
- `RELAY_PICKUP_UNIT_PRICE`
- `BCRYPT_ROUNDS`
- `PICKUP_DEADLINE_DAYS`
- `ENABLE_INTERNAL_SCHEDULER`
- `AUTOMATION_INTERVAL_MS`

Après toute modification d'une variable, créer un nouveau déploiement ou utiliser Redeploy.

## Sécurité à vérifier avant publication

- Remplacer les mots de passe des comptes de démonstration déjà partagés.
- Utiliser un utilisateur Atlas limité à `relayflow`.
- Générer de nouveaux `JWT_SECRET` et `CRON_SECRET` pour la production.
- Vérifier que `.env.local`, `.next`, `node_modules` et `.git` ne sont pas distribués.
- Contrôler les réponses `401`, `403`, `429` et les comptes suspendus.
- Vérifier que les logs ne contiennent ni email, téléphone, adresse, token ou mot de passe.
- Configurer un SMTP réel uniquement avec un compte technique dédié.
- Générer les clés VAPID avant de tester Web Push.

Le stockage actuel du JWT dans `localStorage` est conservé afin de ne pas réécrire toute l'authentification avant la livraison. Pour une production durable, une migration vers un cookie `HttpOnly`, `Secure` et `SameSite` est recommandée.

## Recette fonctionnelle

### Authentification et autorisations

- Connexion super gestionnaire depuis son portail.
- Connexion commerçant depuis son portail.
- Connexion point relais depuis son portail.
- Refus d'un compte sur le mauvais portail.
- Refus d'une requête sans JWT ou avec JWT modifié.
- Refus immédiat d'un compte suspendu.
- Vérification du HTTP `429` après plusieurs échecs successifs.

### Parcours livraison

1. Le commerçant sélectionne un point relais sur la carte.
2. Il crée une livraison et récupère le numéro de suivi.
3. Le point relais accepte la réception et complète la fiche.
4. Le point relais remet le colis et ajoute la preuve demandée.
5. Vérifier l'état, l'historique et les notifications.

Créer ensuite des livraisons distinctes pour tester :

- refus de réception avec motif et signalement automatique ;
- demande puis validation d'un retour ;
- colis non récupéré et automatisation ;
- isolation entre deux commerçants et deux points relais.

### Autres vérifications

- Filtres et pagination des livraisons, utilisateurs et signalements.
- Géocodage d'une adresse puis correction manuelle des coordonnées.
- Carte et marqueur du point relais.
- Signalement, prise en charge, escalade, résolution et notification.
- Factures et bons de paiement.
- Invitations par email avec SMTP réel.
- Notifications en session et Web Push après autorisation du navigateur.

## Passage en production

1. Valider `npm run test:all`, `npm run lint` et `npm run build`.
2. Tester la Preview Vercel avec la base Atlas de test.
3. Consigner les résultats de recette et les limites connues.
4. Ajouter les variables Production.
5. Promouvoir le déploiement validé en Production.
6. Changer ou désactiver les comptes de démonstration après l'évaluation.
