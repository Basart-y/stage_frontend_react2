# Configuration SMTP Gmail — Relais Smart

Pour envoyer réellement les invitations par email :

1. Créer une adresse Gmail dédiée au projet.
2. Activer la validation en deux étapes sur le compte Google.
3. Créer un mot de passe d'application pour Relais Smart (ne jamais utiliser le mot de passe Gmail normal).
4. Renseigner en local dans `.env.local` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-adresse@gmail.com
SMTP_PASSWORD=mot-de-passe-application
SMTP_FROM="Relais Smart <votre-adresse@gmail.com>"
```

5. Ajouter les mêmes variables dans Vercel pour Preview et Production puis redéployer.
6. Depuis l'espace Gestionnaire > Inviter un utilisateur, créer un commerçant ou point relais et vérifier la réception du lien d'activation.

Ne jamais committer `.env.local`, le mot de passe Gmail ou le mot de passe d'application dans GitHub.
