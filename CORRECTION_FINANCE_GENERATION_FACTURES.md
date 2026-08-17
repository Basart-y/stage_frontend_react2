# Correction génération Finance

- Correction de la génération groupée des factures : `userRepository.list()` renvoie un objet paginé (`rows`) et non un tableau direct.
- Même correction appliquée aux bons de paiement des points relais.
- Correction des pages Finance Dashboard et Signalements afin de lire `serviceSignalement.getAll().data` avant `filter()`.
- Évite les erreurs `filter is not a function` et le HTTP 400 provoqué par la route bulk.
