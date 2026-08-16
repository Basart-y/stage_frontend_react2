# Correction des périmètres régionaux

Le contrôle géographique prend désormais en charge les niveaux `ville`, `departement`, `region` et `pays`.

## Correction principale

Un gestionnaire ayant le périmètre `Provence-Alpes-Côte d'Azur` peut maintenant inviter et administrer un commerçant ou un point relais situé dans un département PACA, par exemple `Bouches-du-Rhône` / `Marseille`.

## Compatibilité des comptes existants

Les anciens comptes qui auraient enregistré `Provence-Alpes-Côte d'Azur` comme valeur d'un périmètre `departement` restent compatibles : le backend reconnaît qu'il s'agit d'un nom de région et applique le contrôle régional.

## Interface Super Gestionnaire

Le niveau `Région` a été ajouté aux formulaires de création des gestionnaires.

## Autre correction incluse

Le `server.js` a également été corrigé afin d'appeler `await app.prepare()` avant `getRequestHandler()` et `getUpgradeHandler()`.
