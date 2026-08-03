# Plateforme logistique B2B — guide de démarrage et recette

## Démarrage

1. Vérifier que MongoDB est démarré localement.
2. Dans le dossier du projet :

```powershell
npm install
npm run auth:check
npm run auth:seed -- admin@test.fr "Test123456!"
npm run dev:next
```

3. Ouvrir `http://localhost:3000/login`.

Compte de test initial : `admin@test.fr` / `Test123456!`.

## Tests API

Dans un second terminal, avec le serveur déjà lancé :

```powershell
npm run test:api
```

Les scénarios manuels complémentaires sont dans `TEST_SCENARIOS_NOUVELLES_FONCTIONNALITES.md` et `TEST_RAPIDE_API.txt`.

## Corrections de cette version

- Les actions de signalement utilisent désormais les actions API attendues (`take`, `escalate`, `resolve`, `reject`).
- Le Super Gestionnaire peut utiliser les actions de l’espace Finance lorsqu’il y accède depuis « Accédez aux espaces ».
- Les textes d’inscription ne promettent plus qu’un rôle précis traitera la demande : la formulation indique simplement qu’elle sera traitée.
- Le nom produit a été retiré de l’interface et remplacé par une petite pastille « Plateforme logistique B2B ».
- La planification affiche les points relais sous forme de liste claire et permet de sélectionner directement le relais souhaité.
- Les anciens guides et fichiers de lot ont été retirés. Ce README est le guide principal conservé.

## Gestion des comptes Commerçant et Point relais

Les écrans Manager et Super Gestionnaire ne proposent plus de formulaire de création manuelle pour les comptes Commerçant ou Point relais.

Le parcours retenu est : demande d'inscription → validation ou refus par un Manager / Super Gestionnaire → compte actif après validation.
Les écrans de comptes servent ensuite à consulter, suspendre ou réactiver les comptes existants.

## Finance - actions groupées
- Les factures peuvent être générées pour tous les commerçants actifs ou pour une sélection.
- Les factures en attente peuvent être marquées payées individuellement, par sélection ou toutes en une fois.
- Les bons de paiement peuvent être générés pour tous les points relais actifs ou pour une sélection.
- Le montant d'un bon est recalculé côté serveur à partir des livraisons au statut `Retiré`.
- Les bons en attente peuvent être marqués payés individuellement, par sélection ou tous en une fois.
- Le système ne marque pas automatiquement une facture payée sans information externe de paiement : cela éviterait de valider un paiement qui n'a pas réellement été reçu.


## Mise en conformité CR du 30/07

Voir `DOCUMENTATION_TECHNIQUE_CR_30_07.md`, `DOCUMENTATION_FONCTIONNELLE_CR_30_07.md` et exécuter `npm run test:cr`.
