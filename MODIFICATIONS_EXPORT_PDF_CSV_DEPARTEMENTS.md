# Ajouts — PDF, historique CSV et géographie automatisée

## Fiches PDF
- La fiche de réception peut être téléchargée en PDF depuis l'écran de réception.
- La fiche de remise peut être téléchargée en PDF depuis l'écran de remise.
- Les mêmes PDF sont accessibles depuis le détail d'un colis côté point relais et côté commerçant lorsque les données existent.

## Historique / export des colis
- Le point relais dispose maintenant d'une vue « Historique / export » avec recherche, filtre par statut, période, détail et export CSV.
- Le commerçant conserve sa vue Livraisons avec export CSV et dispose maintenant aussi de filtres par période.
- L'export CSV porte uniquement sur les éléments correspondant aux filtres affichés.

## Départements et périmètres
- Les formulaires utilisent la liste officielle intégrée des départements français sous la forme « 34 - Hérault ».
- La sélection d'une ville principale peut renseigner automatiquement son département.
- La création d'un Gestionnaire propose des listes pour département et région au lieu d'une saisie libre pour le périmètre.
- Les formulaires d'inscription et le profil point relais utilisent également cette liste.

## Vérification
Les utilitaires JavaScript non-JSX ont été vérifiés avec `node --check`.
Le build Next.js n'a pas pu être exécuté dans l'environnement de modification car les dépendances npm ne sont pas disponibles complètement. Exécuter `npm install` puis `npm run build` sur la machine de développement.
