import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { inviteUser } from '@/lib/backend/accountDomain.js';
import { sendInvitationEmail } from '@/lib/backend/email.js';
import { writeAuditTrace } from '@/lib/backend/auditDomain.js';

export async function POST(request) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire']);
  if (auth.error) return auth.error;
  try {
    const result = await inviteUser(await request.json(), auth.claims);
    const activationUrl = new URL('/activation', request.url);
    activationUrl.searchParams.set('email', result.user.email);
    activationUrl.searchParams.set('token', result.invitationToken);
    let emailDelivery = { sent: false, reason: 'NOT_ATTEMPTED' };
    try {
      emailDelivery = await sendInvitationEmail({
        to: result.user.email,
        activationUrl: activationUrl.toString(),
        role: result.user.role,
        expiresAt: result.expiresAt,
      });
    } catch (mailError) {
      emailDelivery = { sent: false, reason: mailError.message || 'EMAIL_SEND_FAILED' };
    }
    await writeAuditTrace({request,eventType:'account.invited',action:'iam.invitation.write',actor:auth.claims,resourceType:'user',resourceId:result.user.id,after:result.user,metadata:{emailDelivery:emailDelivery.sent}});
    return ok({ ...result, activationUrl: activationUrl.toString(), emailDelivery }, { status: 201 });
  } catch (e) {
    const map = {
      INVALID_EMAIL:[400,'Email invalide.'], INVALID_ROLE:[400,'Rôle invalide.'], EMAIL_ALREADY_USED:[409,'Cet email possède déjà un compte.'],
      GRANT_NOT_ALLOWED:[403,'Vous ne pouvez pas inviter ce rôle.'], OUT_OF_SCOPE:[403,'Ce compte est hors de votre périmètre géographique.']
    };
    if (map[e.message]) return apiError(map[e.message][0], e.message, map[e.message][1]);
    return apiError(500, 'INTERNAL_ERROR', 'Invitation impossible.');
  }
}
