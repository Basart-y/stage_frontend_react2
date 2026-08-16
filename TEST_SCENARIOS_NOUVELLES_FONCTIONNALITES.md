# Plateforme logistique B2B — Scénarios de recette backend, API et nouvelles fonctionnalités

Version de test : 28/07/2026

## 0. Préparation

1. Décompresser le ZIP dans un dossier dédié.
2. Ouvrir PowerShell dans le dossier où se trouve `package.json`.
3. Exécuter :

```powershell
npm install
npm run auth:check
npm run auth:seed -- admin@test.fr "Test123456!"
npm run dev:next
```

4. Ouvrir `http://localhost:3000`.
5. MongoDB doit être démarré. Aucune collection n'a besoin d'être créée manuellement : elles sont créées lors des premières écritures.

Résultat attendu pour `auth:check` : JWT_SECRET valide et connexion MongoDB disponible.

---

# 1. Authentification Super Gestionnaire

### S1 — Connexion correcte
- Aller sur `/login`.
- Email : `admin@test.fr`.
- Mot de passe : `Test123456!`.
- Valider.

**Attendu**
- `POST /api/v1/auth/login` → HTTP 200.
- Un JWT est enregistré côté navigateur.
- `GET /api/v1/auth/me` → HTTP 200.
- Redirection vers `/supermanager/dashboard`.

### S2 — Mauvais mot de passe
- Refaire la connexion avec un mauvais mot de passe.

**Attendu**
- `POST /api/v1/auth/login` → HTTP 401.
- Aucun accès au dashboard.

### S3 — JWT absent
- Supprimer `relayflow_access_token` dans le localStorage.
- Ouvrir directement `/manager/dashboard`.

**Attendu**
- Retour vers `/login`.
- Les API protégées retournent HTTP 401.

---

# 2. Accès aux espaces du Super Gestionnaire

### S4 — Bloc « Accédez aux espaces »
- Se connecter comme Super Gestionnaire.
- Sur `/supermanager/dashboard`, repérer le bloc **Accédez aux espaces**.

**Attendu**
Les cinq cartes sont visibles uniquement dans ce bloc :
- Super Gestionnaire
- Gestionnaire
- Gestionnaire financier
- Commerçant
- Point relais

Il ne doit plus y avoir de sélecteur multi-espace dans l'en-tête général.

### S5 — Ouvrir l'espace Gestionnaire
- Cliquer sur « Gestionnaire ».

**Attendu**
- `/manager/dashboard` s'ouvre avec le même compte Super Gestionnaire.
- Le Super Gestionnaire peut consulter les écrans de supervision autorisés.

### S6 — Ouvrir Finance
- Revenir à « Accédez aux espaces » puis cliquer sur « Gestionnaire financier ».

**Attendu**
- `/finance/dashboard` s'ouvre.
- Les lectures autorisées au Super Gestionnaire fonctionnent.
- Une écriture réservée exclusivement au Gestionnaire financier doit rester refusée côté API si la route l'impose.

---

# 3. Nouvelle demande d'inscription Commerçant

### S7 — Envoyer une demande commerçant
- Se déconnecter.
- Aller sur `/inscription/commercant`.
- Saisir un email encore inexistant, par exemple `commerce.test1@example.com`.
- Mot de passe : `Test123456!`.
- Remplir nom, SIRET, ville et **département**.
- Envoyer.

**Attendu**
- `POST /api/v1/registration-requests` → HTTP 201.
- Réponse avec `status: PENDING`.
- MongoDB contient une entrée dans `demandes_inscription`.
- Le mot de passe n'est pas stocké en clair : seul son hash bcrypt est conservé côté backend.
- Des notifications de nouvelle demande sont créées pour Manager et Super Gestionnaire.

### S8 — Demande doublon
- Réenvoyer une demande avec le même email avant validation.

**Attendu**
- HTTP 409.
- Code `REQUEST_ALREADY_PENDING`.

### S9 — Email déjà utilisé
- Après validation du compte du scénario S7, refaire une nouvelle demande avec le même email.

**Attendu**
- HTTP 409.
- Code `EMAIL_ALREADY_USED`.

---

# 4. Nouvelle demande d'inscription Point relais

### S10 — Envoyer une demande point relais
- Aller sur `/inscription/point-relais`.
- Utiliser `relais.test1@example.com`.
- Mot de passe : `Test123456!`.
- Renseigner établissement, ville, département et capacité.
- Envoyer.

**Attendu**
- `POST /api/v1/registration-requests` → HTTP 201.
- `role: point_relais`.
- `status: PENDING`.
- Aucune alerte « mock » ne doit apparaître.

---

# 5. Validation des demandes par Manager / Super Manager

### S11 — Liste des demandes commerçants
- Se connecter comme Manager ou Super Gestionnaire.
- Ouvrir `/manager/demandes-commerces`.

**Attendu**
- `GET /api/v1/registration-requests?role=commercant&status=PENDING` → HTTP 200.
- La demande S7 est visible si elle est dans le périmètre du Manager.
- Pour un Super Gestionnaire, toutes les demandes sont visibles.

### S12 — Validation commerçant
- Cliquer sur **Valider** sur une demande PENDING.

**Attendu**
- `PATCH /api/v1/registration-requests/{id}` avec `action: APPROVE` → HTTP 200.
- La demande passe à `APPROVED`.
- Un document est créé dans `utilisateurs` avec :
  - rôle `commercant` ;
  - `statutCompte: actif` ;
  - profil issu de la demande ;
  - mot de passe hashé.
- L'email disparaît du filtre « À valider » et apparaît dans « Validées ».

### S13 — Connexion du commerçant validé
- Se déconnecter.
- Se connecter avec l'email/mot de passe du scénario S7.

**Attendu**
- Login HTTP 200.
- Redirection `/commercant/dashboard`.

### S14 — Refus d'une demande
- Créer une nouvelle demande puis cliquer **Refuser**.

**Attendu**
- PATCH → HTTP 200.
- Statut `REJECTED`.
- Aucun utilisateur n'est créé dans `utilisateurs`.
- La demande apparaît dans le filtre « Refusées ».

### S15 — Double validation interdite
- Essayer de valider une demande déjà APPROVED ou REJECTED directement via API.

**Attendu**
- HTTP 409.
- Code `REQUEST_ALREADY_DECIDED`.

### S16 — Périmètre Manager
- Utiliser un Manager limité à une ville/département.
- Créer une demande dans un autre périmètre.

**Attendu**
- Elle n'apparaît pas dans sa liste.
- Une tentative directe de PATCH par ID retourne HTTP 403 `OUT_OF_SCOPE`.
- Le Super Gestionnaire peut quand même la traiter.

---

# 6. Gestion des comptes existants

### S17 — Suspension / réactivation
- Suspendre un compte actif depuis le Manager.

**Attendu**
- `PATCH /api/v1/users/{id}/status` → 200.
- Un compte suspendu ne peut plus utiliser les API authentifiées.
- Après réactivation, il peut se reconnecter.

---

# 7. Livraisons API

### S18 — Création livraison par Commerçant
- Connecté en Commerçant, créer une livraison.

**Attendu**
- `POST /api/v1/deliveries` → HTTP 201.
- Numéro de suivi unique.
- État initial cohérent avec la machine à états.

### S19 — Réception par Point relais
- Connecté comme Point relais concerné, accepter la livraison.

**Attendu**
- `POST /api/v1/deliveries/{id}/transition` → HTTP 200.
- Date de réception enregistrée.
- Date limite de retrait calculée.
- Historique complété.

### S20 — Transition interdite
- Tenter une transition impossible depuis l'état courant.

**Attendu**
- HTTP 400/409 selon le handler.
- Aucun changement en base.

### S21 — Refus de réception
- Refuser une livraison avec un motif.

**Attendu**
- Livraison en état refusé.
- Création automatique d'un signalement lié au problème de réception.
- Notification du rôle Gestionnaire.

---

# 8. Signalements et routage

### S22 — Signalement non financier
- Depuis Commerçant ou Point relais, créer un signalement `autre`.

**Attendu**
- `POST /api/v1/reports` → 201.
- `assignedRole: gestionnaire`.

### S23 — Signalement paiement
- Créer un signalement `probleme_paiement`.

**Attendu**
- Routage vers `gestionnaire_financier`.
- Il ne doit pas être assigné au Manager généraliste.

### S24 — Escalade
- Un Manager prend en charge puis escalade un signalement.

**Attendu**
- `POST /api/v1/reports/{id}/action`.
- Statut `escalade`.
- `assignedRole: super_gestionnaire`.
- Notification Super Gestionnaire.

---

# 9. Finance API

### S25 — Génération facture
- Connecté Gestionnaire financier, générer une facture commerçant.

**Attendu**
- `POST /api/v1/finance/invoices` → 201.
- Facture persistée.

### S26 — Génération bon de paiement
- Générer un bon Point relais sur une période.

**Attendu**
- `POST /api/v1/finance/payouts` → 201.
- Le nombre de colis réellement retirés est recalculé côté serveur.
- Montant = nombre de colis retirés × tarif configuré.

### S27 — Permissions Finance
- Connecté comme Commerçant, tenter de créer une facture via API.

**Attendu**
- HTTP 403.

---

# 10. Notifications

### S28 — Lecture notifications
- Avec un utilisateur connecté, ouvrir son centre de notifications.

**Attendu**
- `GET /api/v1/notifications` → 200.
- Les notifications persistées sont présentes.

### S29 — Marquer comme lu
- Marquer une notification comme lue.

**Attendu**
- `POST /api/v1/notifications/read` → 200.
- Le compteur non lu diminue.

---

# 11. Automatisation des colis non récupérés

### S30 — Endpoint cron manuel
Préparer une livraison reçue dont `dateLimiteRetrait` est dépassée puis appeler :

```text
POST /api/v1/automations/mark-overdue-pickups
```

avec le secret cron configuré.

**Attendu**
- La livraison devient non récupérée.
- Historique ajouté automatiquement.
- Notifications générées pour les acteurs concernés.

### S31 — Scheduler interne
Dans `.env.local` :

```env
ENABLE_INTERNAL_SCHEDULER=true
AUTOMATION_INTERVAL_MS=3600000
```

Démarrer le serveur personnalisé lorsque sa partie WebSocket est utilisée.

**Attendu**
- L'automatisation s'exécute périodiquement sans action utilisateur.
- Aucun colis non échu n'est modifié.

---

# 12. WebSocket / temps réel

### S32 — Connexion temps réel
- Lancer le serveur avec WebSocket lorsque le test HMR est validé.
- Se connecter avec un JWT valide.

**Attendu**
- Connexion au canal Plateforme logistique B2B acceptée.
- Heartbeat ping/pong fonctionnel.
- Une notification métier émise est transmise à la session concernée.

### S33 — JWT WebSocket invalide
- Essayer avec un token invalide/expiré.

**Attendu**
- Connexion refusée ou fermée.
- Aucune donnée métier transmise.

---

# 13. Contrôles MongoDB

Après les scénarios, vérifier dans MongoDB les collections créées par l'application, notamment :

- `utilisateurs`
- `demandes_inscription`
- `livraisons`
- `signalements`
- `notifications`
- collections finance selon les opérations exécutées

Ne pas créer ces collections à la main : leur apparition doit être la conséquence des appels API.

---

# 14. Recette finale minimale

Avant de considérer le lot validé :

1. `npm run auth:check` réussit.
2. Super Gestionnaire se connecte.
3. Le bloc « Accédez aux espaces » fonctionne.
4. Une demande Commerçant est créée, visible, validée et le nouveau compte se connecte.
5. Une demande Point relais est créée, visible, validée et le nouveau compte se connecte.
6. Un Manager ne peut pas valider une demande hors périmètre.
7. Une livraison est créée puis réceptionnée.
8. Un refus crée automatiquement un signalement.
9. Un litige paiement est routé vers Finance.
10. Une facture et un bon de paiement sont générés.
11. Les notifications sont persistées et marquées lues.
12. L'automatisation des colis dépassés fonctionne.
13. `npm run build` termine sans erreur avant livraison finale.

---

# 15. Test API automatisé rapide

Une partie des scénarios S1 à S15 peut être exécutée automatiquement après démarrage de l'application.

Terminal 1 :

```powershell
npm run dev:next
```

Terminal 2 :

```powershell
npm run test:api
```

Le script vérifie notamment :
- refus sans JWT ;
- mauvais mot de passe ;
- connexion Super Gestionnaire ;
- `/auth/me` ;
- création d'une demande Commerçant ;
- rejet du doublon ;
- création d'une demande Point relais ;
- lecture des demandes par le Super Gestionnaire ;
- validation des deux demandes ;
- refus d'une double validation ;
- connexion des comptes validés ;
- interdiction pour un Commerçant de lire les demandes d'inscription.

Le script utilise des emails uniques `@example.test` à chaque exécution. Il crée donc des données de recette dans MongoDB ; elles peuvent être supprimées après les tests.

## Scénarios finance groupée ajoutés

### F1 — Génération groupée des factures
1. Se connecter comme Gestionnaire financier ou Super Gestionnaire.
2. Ouvrir Finance > Factures commerçants.
3. Choisir une période puis sélectionner plusieurs commerçants.
4. Cliquer sur « Générer la sélection ».
5. Vérifier que chaque commerçant sélectionné reçoit une facture et qu'un doublon de même période est ignoré.

### F2 — Génération des factures pour tous
1. Ouvrir Finance > Factures commerçants.
2. Cliquer sur « Générer pour tous les commerçants actifs ».
3. Vérifier la création pour tous les comptes actifs sans doublon sur la période.

### F3 — Validation groupée des paiements de factures
1. Cocher plusieurs factures au statut `emise`.
2. Cliquer sur « Valider la sélection ».
3. Vérifier que les factures sélectionnées passent à `payee`.
4. Tester également « Marquer toutes les factures en attente comme payées ».

### F4 — Génération groupée des bons de paiement
1. Ouvrir Finance > Paiements relais.
2. Choisir une période et sélectionner plusieurs points relais actifs.
3. Cliquer sur « Générer la sélection ».
4. Vérifier que le serveur recalcule le nombre de livraisons réellement au statut `Retiré` pour chaque relais.
5. Vérifier le montant : nombre de colis retirés × 1,50 €.

### F5 — Génération des bons pour tous les relais
1. Cliquer sur « Générer pour tous les points relais actifs ».
2. Vérifier qu'un bon est créé pour chaque relais actif et que les doublons de période sont ignorés.

### F6 — Validation groupée des bons de paiement
1. Cocher plusieurs bons au statut `emis`.
2. Cliquer sur « Valider la sélection ».
3. Vérifier qu'ils passent à `paye`.
4. Tester également « Marquer tous les bons en attente comme payés ».

### UI1 — Connexion : retour à l'accueil
1. Ouvrir `/login` sur ordinateur puis sur mobile.
2. Vérifier qu'un bouton visible « Retour à l’accueil » est présent en haut à gauche.
3. Cliquer dessus et vérifier le retour vers `/`.

### UI2 — Notifications sans fonctions non configurées
1. Ouvrir l'écran Notifications.
2. Vérifier que « Temps réel », « Activer Web Push » et les messages VAPID ne sont plus affichés.
3. Vérifier que les notifications persistées et « Tout marquer comme lu » restent disponibles.
