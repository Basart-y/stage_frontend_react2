# Documentation technique — mise en conformité CR du 30/07

## Périmètre livré

Cette version applique les demandes du compte rendu : traçabilité métier et technique, fiches de réception et de remise, notifications de signalement, filtres, pagination, espaces de connexion par rôle, évolution visuelle, tests et documentation.

## Traçabilité métier des colis

Chaque livraison conserve un historique immuable des transitions avec : ancien statut, nouveau statut, acteur, rôle, date, commentaire et métadonnées. Les fiches `receptionSheet` et `handoverSheet` conservent les données détaillées de réception et de remise. Les transitions importantes génèrent une notification.

## Traçabilité technique interne

La collection MongoDB `audit_traces` reçoit les événements sensibles : connexion réussie ou échouée, invitation, suspension/réactivation d’un compte, création et traitement d’un signalement, changement d’état d’une livraison. Une trace contient `requestId`, acteur, rôle, action, ressource, état avant/après, route, méthode HTTP, IP, user-agent et horodatage.

Route de consultation : `GET /api/v1/audit-traces`, réservée aux gestionnaires autorisés.

## Pagination et filtres

- Livraisons : recherche, statut, période, commerçant, point relais, page et limite.
- Utilisateurs : rôle, statut, recherche nom/e-mail/ville, page et limite.
- Signalements : type, statut, référence livraison, texte libre, page et limite.

Les réponses suivent l’enveloppe :

```json
{"data":[],"pagination":{"page":1,"limit":20,"total":0,"hasNext":false},"meta":{"requestId":"..."}}
```

## Espaces de connexion

- `/connexion/commercant`
- `/connexion/point-relais`
- `/connexion/gestionnaire`
- `/connexion/super-gestionnaire`
- `/connexion/finance`

Chaque portail vérifie que le rôle du compte correspond à l’espace demandé.

## Collections principales

`utilisateurs`, `livraisons`, `signalements`, `notifications`, `audit_traces`, `factures`, `bons_paiement`, `points_relais`.

## Sécurité

Les routes vérifient le JWT et les rôles. Les gestionnaires sont limités à leur périmètre géographique. Les mots de passe sont hachés. Les traces d’audit ne stockent jamais les mots de passe ni les jetons.
