# Documentation fonctionnelle — Relais Smart Tijara

## Acteurs

Commerçant, point de relais, gestionnaire, super gestionnaire et gestionnaire financier. Le client et le livreur sont des personnes liées aux livraisons mais ne disposent pas d’un espace applicatif dans ce périmètre.

## Parcours colis

1. Le commerçant crée une livraison et choisit un point relais.
2. Le point relais recherche le colis et consulte sa fiche.
3. À l’arrivée, il accepte ou refuse la réception. Une fiche détaillée est enregistrée.
4. Le colis devient disponible et son historique reste consultable.
5. Lors de la remise, le relais identifie la livraison par référence, nom ou QR code et ajoute la preuve de remise.
6. En cas de problème ou de dépassement, un signalement ou un retour peut être créé.
7. Chaque étape est horodatée et attribuée à l’utilisateur qui l’a effectuée.

## Signalements

Tout signalement est notifié au rôle responsable. Il peut être pris en charge, escaladé, résolu ou rejeté. L’auteur reçoit une notification lorsque le dossier est clos.

## Recherche et scalabilité

Les listes de colis, utilisateurs et signalements utilisent des filtres et une pagination serveur afin de ne pas charger toutes les données en une seule fois.

## Espaces par rôle

Le commerçant gère ses livraisons, points relais, abonnements, notifications, signalements et informations financières. Le point relais réceptionne, remet et retourne les colis. Le gestionnaire administre les commerçants et relais de son périmètre et traite les signalements. Le super gestionnaire configure les gestionnaires et consulte les statistiques globales. Le gestionnaire financier consulte les états financiers, factures et bons de paiement.
