let transporterPromise = null;

async function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporterPromise) {
    transporterPromise = import('nodemailer').then(({ default: nodemailer }) => nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || '' } : undefined,
    }));
  }
  return transporterPromise;
}

export async function sendInvitationEmail({ to, activationUrl, role, expiresAt }) {
  const transporter = await getTransporter();
  if (!transporter) return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!from) throw new Error('SMTP_FROM_MISSING');
  const roleLabel = {
    commercant: 'Commerçant', point_relais: 'Point de Relais', gestionnaire: 'Gestionnaire',
    gestionnaire_financier: 'Gestionnaire Financier',
  }[role] || role;
  const expiration = new Date(expiresAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' });
  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Invitation à activer votre compte',
    text: `Vous avez reçu une invitation avec le rôle ${roleLabel}. Activez votre compte avant le ${expiration} : ${activationUrl}`,
    html: `<p>Vous avez reçu une invitation avec le rôle <strong>${roleLabel}</strong>.</p><p><a href="${activationUrl}">Activer mon compte</a></p><p>Ce lien expire le ${expiration}.</p>`,
  });
  return { sent: true, messageId: info.messageId };
}
