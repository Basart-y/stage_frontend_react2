let transporterPromise = null;
let transporterVerified = false;

function smtpSummary() {
  return {
    host: process.env.SMTP_HOST || null,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    userConfigured: Boolean(process.env.SMTP_USER),
    passwordConfigured: Boolean(process.env.SMTP_PASSWORD),
    fromConfigured: Boolean(
        process.env.SMTP_FROM || process.env.SMTP_USER
    ),
  };
}

function mailErrorReason(error) {
  const parts = [
    error?.code,
    error?.responseCode,
    error?.command,
    error?.message,
  ]
      .filter(Boolean)
      .map(String);

  return parts.join(' | ') || 'EMAIL_SEND_FAILED';
}

async function getTransporter() {
  if (!process.env.SMTP_HOST) {
    console.error(
        '[EMAIL] SMTP non configuré : SMTP_HOST manquant.',
        smtpSummary()
    );

    return null;
  }

  if (!transporterPromise) {
    transporterPromise = import('nodemailer').then(
        ({ default: nodemailer }) =>
            nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT || 587),
              secure:
                  String(process.env.SMTP_SECURE || 'false') ===
                  'true',

              auth: process.env.SMTP_USER
                  ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD || '',
                  }
                  : undefined,
            })
    );
  }

  const transporter = await transporterPromise;

  if (!transporterVerified) {
    try {
      await transporter.verify();

      transporterVerified = true;

      console.log(
          '[EMAIL] Connexion SMTP validée.',
          smtpSummary()
      );
    } catch (error) {
      const reason = mailErrorReason(error);

      console.error(
          '[EMAIL] ÉCHEC de connexion SMTP :',
          reason,
          smtpSummary()
      );

      throw error;
    }
  }

  return transporter;
}

export async function sendInvitationEmail({
                                            to,
                                            activationUrl,
                                            role,
                                            expiresAt,
                                          }) {
  console.log(
      `[EMAIL] Tentative d'envoi de l'invitation vers ${to}`
  );

  const transporter = await getTransporter();

  if (!transporter) {
    return {
      sent: false,
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const from =
      process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!from) {
    console.error('[EMAIL] SMTP_FROM manquant.');

    throw new Error('SMTP_FROM_MISSING');
  }

  const roleLabel =
      {
        commercant: 'Commerçant',
        point_relais: 'Point de Relais',
        gestionnaire: 'Gestionnaire',
        gestionnaire_financier: 'Gestionnaire Financier',
      }[role] || role;

  const expiration = new Date(expiresAt).toLocaleString(
      'fr-FR',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Paris',
      }
  );

  try {
    const info = await transporter.sendMail({
      from,
      to,

      subject: 'Invitation à activer votre compte',

      text:
          `Vous avez reçu une invitation avec le rôle ${roleLabel}. ` +
          `Activez votre compte avant le ${expiration} : ${activationUrl}`,

      html: `
        <p>
          Vous avez reçu une invitation avec le rôle
          <strong>${roleLabel}</strong>.
        </p>

        <p>
          <a href="${activationUrl}">
            Activer mon compte
          </a>
        </p>

        <p>
          Ce lien expire le ${expiration}.
        </p>
      `,
    });

    console.log(
        `[EMAIL] Invitation envoyée avec succès vers ${to}. ` +
        `messageId=${info.messageId || 'n/a'}`
    );

    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const reason = mailErrorReason(error);

    console.error(
        `[EMAIL] ÉCHEC d'envoi vers ${to} : ${reason}`
    );

    throw error;
  }
}