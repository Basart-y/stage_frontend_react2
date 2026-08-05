# Rapport d’implémentation — 03/08/2026

## Carte dans « Planifier une livraison »
- Ajout d’une carte OpenStreetMap interactive sous la recherche des points relais.
- Les résultats ayant des coordonnées valides sont affichés par marqueurs.
- Un clic sur un marqueur sélectionne le point relais, exactement comme le bouton de la fiche.
- Le marqueur sélectionné est visuellement renforcé et la carte se recadre automatiquement.
- Les points sans latitude/longitude restent disponibles dans la liste et sont signalés sous la carte.
- En cas d’indisponibilité du service cartographique, la sélection par liste continue de fonctionner.

## Guide déploiement, logs et tests
- Ajout d’un pipeline GitHub Actions : installation, lint, tests, build.
- Ajout de `vercel.json` avec configuration Next.js et Cron quotidien.
- Ajout de tests automatisés pour les transitions de livraison et le périmètre géographique.
- Ajout d’un identifiant `x-request-id` par requête API.
- Ajout d’un logger JSON structuré et intégration sur la recherche de points relais.
- Conservation de codes d’erreur API stables avec `requestId`.
- Ajout d’un début de contrat `openapi.yaml`.
- Ajout d’un guide d’exploitation dans `docs/GUIDE_TESTS_DEPLOIEMENT_IMPLEMENTE.md`.

## Résultats de validation
- `npm test` : réussi, 5 tests sur 5.
- `npm run lint` : réussi avec 17 avertissements préexistants, aucune erreur bloquante.
- `npm run build` : non validé dans l’environnement de travail, car le registre npm interne n’a pas fourni le paquet binaire SWC demandé par Next.js (erreur HTTP 404). Ce blocage vient de l’environnement de téléchargement, pas d’une erreur de compilation démontrée dans le code.

## Reste à faire pour valider complètement le CR
- Exécuter le build sur une machine avec accès normal au registre npm ou directement sur Vercel.
- Lancer les tests API avec une base MongoDB de test dédiée.
- Tester les parcours navigateur complets : création, réception, remise, refus, retour et signalement.
- Vérifier les emails d’invitation, WebSocket et Web Push avec leurs vraies variables d’environnement.
- Déployer une Preview Vercel, vérifier les variables, puis promouvoir en Production.
- Compléter progressivement `openapi.yaml` pour toutes les routes.
- Étendre le logger structuré à toutes les routes API critiques, pas uniquement à la recherche de points relais.

## Ajustement carte et profil du point relais

- Suppression de l'affichage « À environ 0,0 km » dans la sélection d'un point relais.
- Ajout du code postal dans le profil du point relais.
- Ajout d'un bouton « Calculer depuis l'adresse » : l'adresse, la ville, le code postal et le département sont géocodés via OpenStreetMap/Nominatim.
- Les coordonnées calculées restent modifiables manuellement avant l'enregistrement.
- En cas d'adresse introuvable ou de service indisponible, la saisie manuelle reste possible.
- Ajout d'une route authentifiée `POST /api/v1/geocoding/address` et de logs structurés sans adresse en clair.
