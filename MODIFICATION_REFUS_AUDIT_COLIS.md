# Refus direct et audit des colis

- Un point relais peut déjà refuser une livraison directement depuis l'état `Créée`, depuis la page **Réception des colis**.
- Le refus exige un motif, passe la livraison à l'état `Refusé`, crée le signalement associé et notifie le commerçant.
- Les créations et les transitions de colis sont désormais enregistrées dans `audit_traces` avec :
  - l'état avant et après ;
  - l'entrée d'historique ajoutée ;
  - l'historique complet du colis au moment de l'action ;
  - l'acteur, son rôle, la date, la ressource et le contexte HTTP.
- L'historique reste également conservé dans le document `livraisons`, ce qui permet le suivi fonctionnel du colis.
