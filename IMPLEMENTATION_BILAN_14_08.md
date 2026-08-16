# Implémentation du bilan du 14/08

Les 10 points du bilan ont été repris dans le projet :

1. Retours : sélection multiple côté commerçant, motif obligatoire, consultation et confirmation côté point relais, historique/statut mis à jour.
2. Invitations : page Gestionnaire dédiée, création commerçant/point relais, email SMTP et activation par lien.
3. Signalements : routage paiement vers finance, routage géographique vers les gestionnaires concernés, prise en charge/résolution/rejet/escalade.
4. Finance utilisateurs : page « Mes factures » commerçant et « Mes bons de paiement » point relais.
5. Bons de paiement : calcul sur les colis au statut Retiré dont la date de retrait appartient à la période demandée, avec tarif configurable.
6. Non récupérés : automatisation existante conservée (`/api/v1/automations/mark-overdue-pickups`) avec notification lors du changement d'état.
7. Notifications : persistance, temps réel et Web Push conservés.
8. QR code : l'étiquette contient maintenant un QR code construit à partir de la référence de suivi.
9. OpenAPI : toutes les routes présentes sous `app/api` sont recensées dans `openapi.yaml`.
10. Tests : 12 tests automatisés passent (`node --test tests/*.test.js`).

## Point externe restant

L'envoi SMTP réel nécessite de créer/configurer un compte Gmail et d'ajouter ses secrets dans `.env.local` et Vercel. Voir `CONFIGURATION_SMTP_GMAIL.md`. Aucun secret réel n'est inclus dans le projet.
