# Modifications réalisées selon le CR du 30/07

## Traçabilité métier des colis
- Historique horodaté de chaque changement d’état.
- Acteur et rôle associés à chaque transition.
- Fiche de réception persistée lors de l’entrée au point relais.
- Fiche de remise persistée lors du retrait par le client.

## Traçabilité technique interne
- Nouvelle collection MongoDB `audit_traces`.
- Une trace contient : `requestId`, type d’événement, action, acteur, rôle, ressource, état avant/après, date, méthode HTTP, route, IP et user-agent.
- Nouvelle API manager : `GET /api/v1/audit-traces`.
- Nouvel écran manager : `/manager/tracabilite-technique`.

## Pagination et filtres
- `GET /api/v1/deliveries` accepte désormais `page`, `limit`, `status` et `query`.
- La réponse expose `page`, `limit`, `total` et `hasNext`.

## Notifications et signalements
- Les changements d’état continuent de notifier le commerçant et le point relais.
- Un refus de réception crée automatiquement un signalement et notifie le rôle gestionnaire concerné.

## Vérification
- Les fichiers JavaScript modifiés ont été vérifiés avec `node --check`.
- Le build complet n’a pas pu être exécuté dans l’environnement fourni, car le registre npm interne ne contient pas le paquet `bcrypt@^6.0.0`.
