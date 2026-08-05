import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=[
 'lib/backend/auditRepository.js','lib/backend/auditDomain.js','app/api/v1/audit-traces/route.js',
 'app/(manager)/manager/tracabilite-technique/page.jsx','DOCUMENTATION_TECHNIQUE.md','DOCUMENTATION_FONCTIONNELLE.md',
 'app/connexion/commercant/page.jsx','app/connexion/point-relais/page.jsx','app/connexion/gestionnaire/page.jsx','app/connexion/super-gestionnaire/page.jsx','app/connexion/finance/page.jsx'
];
let failed=false;
for(const file of required){const ok=fs.existsSync(path.join(root,file));console.log(`${ok?'OK':'MANQUANT'} ${file}`);failed ||= !ok;}
const checks=[
 ['delivery sheets','lib/backend/deliveryDomain.js',/receptionSheet|handoverSheet/],
 ['delivery audit','lib/backend/deliveryDomain.js',/writeAuditTrace/],
 ['users pagination','lib/backend/userRepository.js',/countDocuments/],
 ['reports pagination','lib/backend/reportRepository.js',/countDocuments/],
 ['report notifications','lib/backend/reportDomain.js',/createNotification/],
];
for(const [name,file,re] of checks){const ok=re.test(fs.readFileSync(path.join(root,file),'utf8'));console.log(`${ok?'OK':'ECHEC'} ${name}`);failed ||= !ok;}
if(failed) process.exit(1);
console.log('Conformité structurelle CR 30/07 : OK');
