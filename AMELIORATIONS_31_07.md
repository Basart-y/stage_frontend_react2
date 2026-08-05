# Améliorations du 31/07 — interface et saisie professionnelle

## Palette et lisibilité

- palette éclaircie et harmonisée autour d’un bleu profond, d’un bleu d’action et de fonds gris-bleu très légers ;
- contraste renforcé pour les textes, bordures et champs ;
- fond général plus doux et cartes plus lisibles ;
- conservation d’une hiérarchie claire entre navigation, actions principales et informations secondaires.

## Sélecteurs intelligents dans la planification

Un composant générique `Combobox` a été ajouté. Il fournit :

- affichage de la liste au focus ;
- filtrage instantané pendant la saisie ;
- priorité aux noms qui commencent par les lettres saisies ;
- navigation au clavier (flèches, Entrée, Échap) ;
- sélection à la souris ;
- possibilité de conserver une saisie libre lorsqu’aucun résultat ne correspond.

### Clients

La liste est construite à partir des clients déjà présents dans l’historique des livraisons du commerçant. Sélectionner un client remplit automatiquement le prénom, le nom et le téléphone disponible.

### Livreurs / transporteurs

La liste est construite à partir des livreurs ou transporteurs déjà utilisés dans l’historique du commerçant. La saisie libre reste possible pour un nouveau transporteur.

Ce choix respecte le périmètre fonctionnel fourni : le client et le livreur ne sont pas des acteurs disposant d’un compte dans cette application.

## Validation

Le code a été contrôlé manuellement. Le build automatisé n’a pas pu être exécuté dans l’environnement de préparation, car le registre de paquets disponible ne fournit pas la dépendance `bcrypt@^6.0.0`. Une validation locale reste nécessaire après `npm install` dans un environnement ayant accès au registre npm complet.
