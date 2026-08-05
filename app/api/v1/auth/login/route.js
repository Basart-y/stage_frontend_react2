import { ok, apiError } from '@/lib/backend/http.js';
import { login } from '@/lib/backend/accountDomain.js';
import { writeAuditTrace } from '@/lib/backend/auditDomain.js';
export async function POST(request) {
  let email='';
  try {
    const body=await request.json(); email=String(body?.email||'').trim().toLowerCase();
    const session=await login(body);
    await writeAuditTrace({request,eventType:'auth.login.succeeded',action:'identity.login',actor:{sub:session.user.id,role:session.user.role},resourceType:'identity',resourceId:session.user.id,metadata:{email,portalRole:String(body?.portalRole||'')}});
    return ok(session);
  } catch (e) {
    await writeAuditTrace({request,eventType:'auth.login.failed',action:'identity.login',resourceType:'identity',resourceId:email||'unknown',metadata:{email,errorCode:e.message}}).catch(()=>{});
    if (e.message === 'ROLE_PORTAL_MISMATCH') return apiError(403, e.message, 'Ce compte ne peut pas se connecter depuis cet espace.');
    if (e.message === 'INVALID_PORTAL_ROLE') return apiError(400, e.message, 'Espace de connexion invalide.');
    if (e.message === 'INVALID_CREDENTIALS') return apiError(401, e.message, 'Email ou mot de passe incorrect.');
    if (e.message === 'ACCOUNT_SUSPENDED') return apiError(403, e.message, 'Ce compte est suspendu.');
    if (e.message === 'ACCOUNT_INACTIVE') return apiError(403, e.message, 'Ce compte n’est pas encore actif.');
    if (e.message === 'JWT_SECRET_MISSING_OR_WEAK') return apiError(500,e.message,'Configuration serveur invalide : JWT_SECRET doit contenir au moins 32 caractères.');
    if (e?.name === 'MongoServerSelectionError' || /ECONNREFUSED|MongoServerSelection/i.test(String(e?.message || ''))) return apiError(503,'MONGODB_UNAVAILABLE','MongoDB est inaccessible. Vérifiez que le serveur MongoDB est démarré et que MONGODB_URI est correct.');
    console.error('[auth/login]',e); return apiError(500,'INTERNAL_ERROR','Connexion impossible. Consultez le terminal du serveur pour le détail.');
  }
}
