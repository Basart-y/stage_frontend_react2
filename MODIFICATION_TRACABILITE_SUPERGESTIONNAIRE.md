# Traçabilité Super Gestionnaire

Ajout d'un espace `/supermanager/tracabilite` réservé au Super Gestionnaire.

Fonctions :
- journal global des traces d'audit ;
- filtres par rôle, type d'élément, action et période ;
- recherche libre ;
- pagination ;
- export CSV de l'ensemble des résultats correspondant aux filtres ;
- affichage volontairement métier, sans route API, IP, user-agent ou contexte technique.

L'API `/api/v1/audit-traces` accepte maintenant également les filtres `actorRole`, `action`, `dateFrom` et `dateTo`.
