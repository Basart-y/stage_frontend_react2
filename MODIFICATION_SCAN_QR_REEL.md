# Scan QR réel — 17/08/2026

- Remplacement de la zone de démonstration de la page Réception par un vrai scanner caméra.
- Ajout du même scanner dans la page Remise au client.
- Le scanner utilise l'API navigateur `BarcodeDetector` avec le format `qr_code` et `getUserMedia`.
- Après lecture, la référence contenue dans le QR est recherchée automatiquement.
- Réception : si le colis est attendu, sa fiche est sélectionnée automatiquement pour validation.
- Remise : si le colis est disponible au relais, sa fiche est sélectionnée et le mode d'identification passe automatiquement à `qr_code`.
- Si le QR existe mais ne correspond pas à un colis éligible, l'utilisateur reçoit un message explicite.
- Si la caméra ou `BarcodeDetector` n'est pas disponible, la recherche manuelle reste utilisable.

Test conseillé : Chrome récent, sur `https://` (Preview Vercel) ou `localhost`, avec autorisation caméra.
