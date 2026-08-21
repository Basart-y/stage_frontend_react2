# Documentation complète du projet — Plateforme logistique B2B

> Version documentée : projet fourni le 21/08/2026.
>
> Cette documentation décrit l'organisation du code, les rôles, les parcours, les API, la base de données, la configuration, les tests et les comptes de démonstration présents/attendus pour la recette.

---

## 1. Présentation générale

La plateforme est une application logistique B2B destinée à connecter plusieurs acteurs d'un réseau de livraison :

- les **commerçants**, qui créent et suivent les livraisons ;
- les **points relais**, qui réceptionnent, remettent et retournent les colis ;
- les **gestionnaires**, qui administrent un périmètre géographique et supervisent les acteurs et opérations ;
- le **super gestionnaire**, qui dispose d'une vision globale et de fonctions d'administration avancées ;
- les **gestionnaires financiers**, qui traitent la facturation, les paiements et les éléments financiers associés.

Le projet comprend également :

- un suivi public de colis ;
- un système d'inscription et d'invitation ;
- des notifications applicatives, WebSocket et Web Push ;
- une traçabilité/audit des actions ;
- des signalements ;
- des automatisations métier ;
- une documentation OpenAPI ;
- des tests unitaires et scripts de recette API.

---

## 2. Stack technique

### Frontend

- **Next.js 16** avec App Router ;
- **React 19** ;
- **Tailwind CSS 4** ;
- **lucide-react** pour les icônes.

### Backend

Le backend est intégré au projet Next.js via les routes `app/api/...` et complété par un serveur Node personnalisé.

- API REST avec Route Handlers Next.js ;
- serveur Node dans `server.js` ;
- WebSocket avec `ws` ;
- authentification JWT HMAC SHA-256 ;
- mots de passe hachés avec **bcrypt** ;
- envoi d'e-mails avec **Nodemailer** ;
- notifications Web Push avec **web-push**.

### Données

- **MongoDB** avec le driver officiel `mongodb` ;
- base par défaut : `relayflow` ;
- possibilité de fonctionnement mémoire pour certains repositories en environnement de développement lorsque MongoDB n'est pas configuré.

---

## 3. Structure principale du projet

```text
app/                  Pages Next.js, layouts et routes API
composants/           Composants React partagés
services/             Services frontend / appels API
lib/backend/          Domaines métier, repositories, auth, logs, MongoDB
lib/domain/           Règles métier partagées
hooks/                Hooks React
donnees/              Jeux de données/fichiers fictifs
public/                Ressources publiques et service worker
tests/                 Tests Node
server.js              Serveur Next.js + WebSocket
openapi.yaml           Description OpenAPI
.env.example           Exemple de configuration
```

---

## 4. Page d'accueil

La page d'accueil se trouve dans :

```text
app/page.jsx
```

### Modification du 21/08/2026

Le bloc **« Vue opérationnelle »** a été supprimé de la page d'accueil.

Ce panneau contenait notamment :

- des statistiques de livraisons ;
- un nombre de relais actifs ;
- un nombre d'éléments à valider ;
- un exemple de flux de livraison.

Après suppression, le hero d'accueil est recentré et conserve :

- le message principal ;
- la présentation de la plateforme ;
- le bouton d'inscription ;
- les éléments de réassurance ;
- les cartes de présentation des fonctions principales.

---

## 5. Rôles et espaces de connexion

La plateforme possède cinq rôles applicatifs principaux.

| Rôle technique | Rôle fonctionnel | Portail de connexion | Espace principal |
|---|---|---|---|
| `commercant` | Commerçant | `/connexion/commercant` | `/commercant/dashboard` |
| `point_relais` | Point relais | `/connexion/point-relais` | `/point-relais/dashboard` |
| `gestionnaire` | Gestionnaire | `/connexion/gestionnaire` | `/manager/dashboard` |
| `super_gestionnaire` | Super gestionnaire | `/connexion/super-gestionnaire` | `/supermanager/dashboard` |
| `gestionnaire_financier` | Gestionnaire financier | `/connexion/finance` | `/finance/dashboard` |

La séparation des portails est également contrôlée côté serveur : le frontend transmet le rôle du portail utilisé et le backend vérifie que ce rôle correspond réellement au compte avant de créer le jeton d'accès.

Les autorisations sensibles sont ensuite revalidées côté API avec `requireAuth`.

---

## 6. Comptes et identifiants de démonstration

> **Important :** ces mots de passe sont documentés en clair uniquement parce qu'il s'agit de comptes de démonstration/recette explicitement fournis pour ce projet. Ne pas réutiliser ces identifiants en production ni pour des comptes personnels.

| Utilisateur | Mot de passe | Rôle attendu | Portail conseillé |
|---|---|---|---|
| `admin@test.fr` | `Test123456!` | Super gestionnaire | `/connexion/super-gestionnaire` |
| `commerce.demo@test.fr` | `Test123456!` | Commerçant | `/connexion/commercant` |
| `relais.demo@test.fr` | `Test123456!` | Point relais | `/connexion/point-relais` |
| `gestionnaire.demo@test.fr` | `Test123456!` | Gestionnaire | `/connexion/gestionnaire` |

Le compte `admin@test.fr` est également le compte de test initial référencé dans le `README.md` et dans les scripts de recette. Le script `scripts_seed_supermanager.js` crée un utilisateur avec le rôle `super_gestionnaire`.

### Création du super gestionnaire de test

Avec `.env.local` configuré :

```powershell
npm run auth:seed -- admin@test.fr "Test123456!"
```

Le script refuse la création si l'adresse existe déjà dans la collection `utilisateurs`.

---

## 7. Authentification et sécurité

### Connexion

Endpoint :

```text
POST /api/v1/auth/login
```

Le backend :

1. recherche l'utilisateur par e-mail ;
2. vérifie le mot de passe ;
3. vérifie que le compte est actif ;
4. vérifie le rôle attendu par le portail de connexion ;
5. met à jour la date de dernière connexion ;
6. génère un jeton JWT d'une durée de **15 minutes**.

### Vérification des droits

Les routes sensibles utilisent `requireAuth`.

À chaque requête protégée, le compte est relu afin qu'une suspension, un changement de rôle ou un changement de périmètre soit pris en compte immédiatement.

### Hachage des mots de passe

- algorithme principal : `bcrypt` ;
- coût configurable via `BCRYPT_ROUNDS` ;
- valeur par défaut : `12` ;
- les anciens hashes pris en charge peuvent être migrés automatiquement après une connexion réussie.

### JWT

Variable requise :

```text
JWT_SECRET
```

Elle doit contenir au moins 32 caractères.

---

## 8. Espaces fonctionnels

### 8.1 Commerçant

Routes principales :

```text
/commercant/dashboard
/commercant/commerce
/commercant/livraisons
/commercant/planification
/commercant/points-relais
/commercant/suivi
/commercant/signalements
/commercant/notifications
/commercant/finance
/commercant/abonnements
/commercant/profil
```

Fonctions principales :

- gestion du profil commerce ;
- planification et création de livraisons ;
- sélection d'un point relais ;
- suivi des livraisons ;
- consultation des points relais ;
- signalements ;
- notifications ;
- informations financières et abonnement.

### 8.2 Point relais

Routes principales :

```text
/point-relais/dashboard
/point-relais/reception
/point-relais/retrait
/point-relais/retour
/point-relais/suivi
/point-relais/signalements
/point-relais/notifications
/point-relais/finance
/point-relais/profil
```

Fonctions principales :

- réception des colis ;
- remise/retrait par le destinataire ;
- retour des colis ;
- suivi des opérations ;
- signalements ;
- notifications ;
- informations financières ;
- gestion du profil du relais.

### 8.3 Gestionnaire

Routes principales :

```text
/manager/dashboard
/manager/demandes-commerces
/manager/demandes-points-relais
/manager/invitations
/manager/livraisons
/manager/points-relais
/manager/signalements
/manager/notifications
/manager/tracabilite-technique
/manager/profil
```

Fonctions principales :

- validation/refus des demandes d'inscription ;
- gestion des acteurs de son périmètre ;
- invitations ;
- supervision des livraisons ;
- gestion des signalements ;
- consultation des notifications ;
- traçabilité technique ;
- gestion du profil et du périmètre.

### 8.4 Super gestionnaire

Routes principales :

```text
/supermanager/dashboard
/supermanager/commerces
/supermanager/points-relais
/supermanager/managers
/supermanager/finance-managers
/supermanager/signalements
/supermanager/notifications
/supermanager/statistiques
/supermanager/tracabilite
/supermanager/profil
```

Fonctions principales :

- administration globale ;
- gestion des commerçants et points relais ;
- gestion des gestionnaires ;
- gestion des gestionnaires financiers ;
- supervision des signalements ;
- statistiques ;
- traçabilité/audit ;
- accès aux espaces spécialisés.

### 8.5 Gestionnaire financier

Routes principales :

```text
/finance/dashboard
/finance/factures
/finance/paiements
/finance/signalements
/finance/notifications
```

Fonctions principales :

- génération et suivi des factures ;
- génération et suivi des bons de paiement ;
- traitement des statuts financiers ;
- signalements ;
- notifications.

---

## 9. Parcours métier principaux

### Inscription

La plateforme propose des entrées d'inscription pour :

```text
/inscription/commercant
/inscription/point-relais
```

Le parcours prévu est :

```text
demande d'inscription
        ↓
validation ou refus par un gestionnaire / super gestionnaire
        ↓
création ou activation du compte
        ↓
accès à l'espace correspondant
```

### Invitation

Un utilisateur autorisé peut inviter certains rôles. Le compte est créé dans l'état `invite` avec un token d'activation limité dans le temps.

L'invitation expire après **48 heures**.

Endpoints concernés :

```text
POST /api/v1/users/invite
POST /api/v1/invitations/inspect
POST /api/v1/invitations/accept
```

### Livraison

Le projet gère le cycle de vie d'une livraison et ses transitions d'état. Les règles centrales sont situées dans :

```text
lib/domain/deliveryState.js
lib/backend/deliveryDomain.js
```

Les opérations métier incluent notamment :

- création ;
- acheminement/réception ;
- disponibilité au relais ;
- retrait/remise ;
- refus ;
- retour ;
- dépassement du délai de retrait.

### Signalements

Les signalements sont accessibles aux différents espaces selon leurs droits. Ils peuvent notamment être pris en charge, escaladés, résolus ou rejetés selon les règles de l'API.

### Finance

La finance couvre :

- les factures des commerçants ;
- les bons de paiement des points relais ;
- les opérations groupées ;
- les changements de statut ;
- un résumé financier.

---

## 10. API REST

Les routes principales présentes dans le projet sont :

### Authentification

```text
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Utilisateurs

```text
GET/POST /api/v1/users
GET/PATCH /api/v1/users/[id]
PATCH /api/v1/users/[id]/status
POST /api/v1/users/invite
```

### Inscriptions et invitations

```text
GET/POST /api/v1/registration-requests
GET/PATCH /api/v1/registration-requests/[id]
POST /api/v1/invitations/inspect
POST /api/v1/invitations/accept
```

### Livraisons

```text
GET/POST /api/v1/deliveries
GET/PATCH /api/v1/deliveries/[id]
POST /api/v1/deliveries/[id]/transition
```

### Points relais

```text
GET /api/relay-points
GET/POST /api/v1/relay-points
GET/PATCH /api/v1/relay-points/me
```

### Signalements

```text
GET/POST /api/v1/reports
GET/PATCH /api/v1/reports/[id]
POST /api/v1/reports/[id]/action
```

### Notifications

```text
GET/POST /api/v1/notifications
POST /api/v1/notifications/read
POST /api/v1/notifications/push-subscription
```

### Finance — factures

```text
GET/POST /api/v1/finance/invoices
POST /api/v1/finance/invoices/bulk
PATCH /api/v1/finance/invoices/bulk-status
PATCH /api/v1/finance/invoices/[id]/status
```

### Finance — paiements points relais

```text
GET/POST /api/v1/finance/payouts
POST /api/v1/finance/payouts/bulk
PATCH /api/v1/finance/payouts/bulk-status
PATCH /api/v1/finance/payouts/[id]/status
GET /api/v1/finance/summary
```

### Audit, temps réel et automatisations

```text
GET  /api/v1/audit-traces
GET  /api/v1/realtime/status
POST /api/v1/automations/mark-overdue-pickups
```

### Géocodage

```text
GET /api/v1/geocoding/address
```

La spécification détaillée se trouve dans :

```text
openapi.yaml
```

---

## 11. Base de données MongoDB

### Configuration

Variables :

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=relayflow
```

En production, `MONGODB_URI` doit être remplacée par l'URI MongoDB Atlas.

### Collections utilisées dans le code

```text
utilisateurs
demandes_inscription
livraisons
signalements
notifications
audit_traces
factures
bons_paiement
pushSubscriptions
```

### Utilisateurs

La collection principale des comptes est :

```text
utilisateurs
```

Les données peuvent notamment inclure :

- `id` ;
- `email` ;
- `passwordHash` ;
- `role` ;
- `statutCompte` ;
- `scope` ;
- `profile` ;
- informations d'invitation ;
- date de création ;
- date d'activation ;
- dernière connexion.

Les mots de passe ne doivent jamais être stockés en clair dans MongoDB : seul `passwordHash` doit être enregistré.

---

## 12. Périmètres géographiques

La logique de périmètre se trouve principalement dans :

```text
lib/backend/geography.js
```

Elle permet de limiter certaines actions des gestionnaires à leur zone autorisée.

Les tests existants couvrent notamment :

- le respect d'un périmètre départemental ;
- l'autorisation d'un périmètre pays pour les zones françaises.

---

## 13. Notifications et temps réel

### Notifications applicatives

Les notifications utilisent :

```text
lib/backend/notificationDomain.js
lib/backend/notificationRepository.js
services/ServiceNotification.js
```

### WebSocket

Le serveur temps réel est intégré à :

```text
server.js
```

Endpoint WebSocket :

```text
/ws?token=<JWT>
```

Le serveur vérifie le JWT puis relit le compte afin de s'assurer qu'il est toujours actif avant d'accepter la connexion.

### Web Push

Variables nécessaires :

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@example.com
```

Génération des clés :

```powershell
npx web-push generate-vapid-keys
```

Le service worker est situé dans :

```text
public/sw.js
```

---

## 14. E-mails et SMTP

Variables disponibles :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="Relais Smart <votre-adresse@gmail.com>"
```

La logique d'envoi est dans :

```text
lib/backend/email.js
```

Une documentation spécifique est également présente :

```text
CONFIGURATION_SMTP_GMAIL.md
```

---

## 15. Automatisations

La plateforme possède une automatisation pour les colis dont le délai de retrait est dépassé.

Endpoint :

```text
POST /api/v1/automations/mark-overdue-pickups
```

Variables associées :

```env
CRON_SECRET=change-me
PICKUP_DEADLINE_DAYS=7
ENABLE_INTERNAL_SCHEDULER=false
AUTOMATION_INTERVAL_MS=3600000
```

Lorsque `ENABLE_INTERNAL_SCHEDULER=true`, `server.js` lance périodiquement l'automatisation.

---

## 16. Finance

Variables de référence :

```env
MERCHANT_MONTHLY_PRICE=19.90
RELAY_PICKUP_UNIT_PRICE=1.50
```

Fonctions prévues :

- génération de factures commerçants ;
- génération de factures pour une sélection ou tous les commerçants actifs ;
- changement de statut individuel ou groupé ;
- génération de bons de paiement pour les points relais ;
- calcul serveur du montant selon les livraisons concernées ;
- suivi des paiements ;
- résumé financier.

Le projet ne considère pas automatiquement qu'une facture est payée sans information externe confirmant le paiement.

---

## 17. Journalisation et audit

Les fonctions associées à la traçabilité se trouvent notamment dans :

```text
lib/backend/logger.js
lib/backend/auditDomain.js
lib/backend/auditRepository.js
```

Collection :

```text
audit_traces
```

Les connexions réussies et échouées produisent par exemple des traces d'audit.

---

## 18. Variables d'environnement

Exemple complet adapté du fichier `.env.example` :

```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=relayflow

# Authentification
JWT_SECRET=une-cle-secrete-de-plus-de-32-caracteres

# Automatisation
CRON_SECRET=change-me
PICKUP_DEADLINE_DAYS=7
ENABLE_INTERNAL_SCHEDULER=false
AUTOMATION_INTERVAL_MS=3600000

# Finance
MERCHANT_MONTHLY_PRICE=19.90
RELAY_PICKUP_UNIT_PRICE=1.50

# Sécurité mots de passe
BCRYPT_ROUNDS=12

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="Relais Smart <votre-adresse@gmail.com>"

# Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@example.com
```

### À ne pas versionner

Ne jamais committer dans Git :

- `.env.local` ;
- les vrais mots de passe SMTP ;
- la vraie URI MongoDB Atlas avec son mot de passe ;
- `JWT_SECRET` de production ;
- `CRON_SECRET` de production ;
- la clé privée VAPID.

---

## 19. Installation locale

### Prérequis

- Node.js compatible avec Next.js 16 ;
- npm ;
- MongoDB local ou MongoDB Atlas ;
- un fichier `.env.local` correctement configuré.

### Installation

```powershell
npm install
```

### Vérification de l'authentification

```powershell
npm run auth:check
```

### Création du super gestionnaire initial

```powershell
npm run auth:seed -- admin@test.fr "Test123456!"
```

### Démarrage avec le serveur Next.js standard

```powershell
npm run dev:next
```

### Démarrage avec le serveur personnalisé WebSocket

```powershell
npm run dev
```

Application locale :

```text
http://localhost:3000
```

---

## 20. Scripts npm

| Commande | Usage |
|---|---|
| `npm run dev` | Démarre `server.js` avec Next.js + WebSocket |
| `npm run dev:next` | Démarre Next.js en développement |
| `npm run build` | Build de production Next.js |
| `npm run start` | Démarre le serveur personnalisé en production |
| `npm run lint` | Lance ESLint |
| `npm run auth:check` | Vérifie la configuration/authentification |
| `npm run auth:seed -- <email> <mdp>` | Crée un super gestionnaire |
| `npm run test` | Lance les tests Node dans `tests/` |
| `npm run test:api` | Lance le script de smoke test API |
| `npm run test:cr` | Lance les tests de conformité du CR |
| `npm run test:all` | Lance les tests Node + conformité CR |

---

## 21. Tests présents dans le projet

### Tests Node

Dossier :

```text
tests/
```

Fichiers actuellement présents :

```text
tests/delivery-state.test.js
tests/geography.test.js
```

Ils couvrent notamment :

- les transitions interdites ;
- les états terminaux ;
- les transitions après réception ;
- les périmètres géographiques.

### Scripts de recette complémentaires

```text
scripts_api_smoke_test.js
scripts_cr_compliance_test.js
TEST_SCENARIOS_NOUVELLES_FONCTIONNALITES.md
TEST_RAPIDE_API.txt
```

---

## 22. Build et déploiement

### Build local

```powershell
npm run build
```

### Vercel

Le projet contient :

```text
vercel.json
```

Pour un déploiement Vercel, ajouter dans l'environnement ciblé au minimum :

- `MONGODB_URI` ;
- `MONGODB_DB` ;
- `JWT_SECRET` ;
- les secrets SMTP si les invitations par e-mail sont utilisées ;
- les clés VAPID si Web Push est utilisé ;
- les variables finance ;
- `CRON_SECRET` si l'automatisation l'utilise.

### MongoDB Atlas

Pour Atlas :

1. créer le cluster ;
2. créer un utilisateur de base de données ;
3. autoriser les accès réseau nécessaires ;
4. récupérer l'URI `mongodb+srv://...` ;
5. remplacer le mot de passe dans l'URI ;
6. enregistrer cette URI dans `MONGODB_URI` sur Vercel ;
7. vérifier `MONGODB_DB=relayflow` ou le nom de base réellement utilisé.

---

## 23. Documentation complémentaire déjà incluse

Le projet contient également plusieurs documents spécialisés, notamment :

```text
README.md
DOCUMENTATION_TECHNIQUE_CR_30_07.md
DOCUMENTATION_FONCTIONNELLE_CR_30_07.md
ETAT_EXACT_CR_30_07.md
CONFIGURATION_SMTP_GMAIL.md
CORRECTION_FINANCE_GENERATION_FACTURES.md
MODIFICATION_SCAN_QR_REEL.md
MODIFICATION_TRACABILITE_SUPERGESTIONNAIRE.md
CORRECTION_PERIMETRES_REGIONAUX.md
MODIFICATIONS_EXPORT_PDF_CSV_DEPARTEMENTS.md
REFONTE_COULEURS_INTERFACE.md
ACCESSIBILITE_COULEURS.md
```

Le présent document sert de **point d'entrée global** pour comprendre le projet dans son ensemble.

---

## 24. Recommandations avant mise en production

Avant une mise en production réelle :

1. remplacer tous les secrets de développement ;
2. ne pas conserver de mot de passe de démonstration sur des comptes de production ;
3. vérifier que tous les comptes de recette ont le bon rôle et le bon périmètre ;
4. exécuter `npm run build` ;
5. exécuter `npm run test:all` ;
6. exécuter les tests API avec une base réservée à la recette ;
7. tester les parcours navigateur par rôle ;
8. tester les invitations e-mail ;
9. tester les notifications WebSocket et Web Push ;
10. vérifier les variables Vercel et la connexion Atlas ;
11. tester le déploiement Preview avant promotion en Production ;
12. changer les mots de passe de démonstration ou supprimer ces comptes après validation finale.

---

## 25. Résumé rapide

La plateforme centralise les opérations d'un réseau de livraison autour de cinq espaces sécurisés. Le frontend est construit avec Next.js/React, le backend repose sur les routes API Next.js et MongoDB, avec un serveur personnalisé pour le WebSocket. Les fonctions principales couvrent l'inscription, les invitations, les livraisons, la réception et la remise, les retours, les signalements, la finance, les notifications et la traçabilité.

Pour la recette, les quatre comptes documentés sont :

```text
admin@test.fr                / Test123456!
commerce.demo@test.fr        / Test123456!
relais.demo@test.fr          / Test123456!
gestionnaire.demo@test.fr    / Test123456!
```

Le bloc « Vue opérationnelle » de la page d'accueil a été retiré le 21/08/2026.
