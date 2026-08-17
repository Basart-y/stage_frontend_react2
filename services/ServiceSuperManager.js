import { serviceAdministration } from '@/services/ServiceAdministration.js';

export const serviceSuperManager = {
  async getManagers() {
    const result = await serviceAdministration.listUsers({ role: 'gestionnaire' });
    return Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
  },
  async getFinanceManagers() {
    const result = await serviceAdministration.listUsers({ role: 'gestionnaire_financier' });
    return Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
  },
  async getManagerById(id) { return serviceAdministration.getUser(id); },
  async createManager(data) {
    return serviceAdministration.inviteUser({
      email: data.email,
      role: 'gestionnaire',
      profile: {
        prenom: data.firstName || '', nomFamille: data.lastName || '', telephone: data.phone || '',
        ville: data.city || '', departement: data.departement || (data.scopeLevel === 'departement' ? data.scopeValue : ''),
      },
      scope: { niveau: data.scopeLevel || 'departement', ...(data.scopeLevel === 'pays' ? {} : { valeur: data.scopeValue || data.city || '' }) },
    });
  },
  async createFinanceManager(data) {
    return serviceAdministration.inviteUser({
      email: data.email,
      role: 'gestionnaire_financier',
      profile: {
        prenom: data.firstName || '',
        nomFamille: data.lastName || '',
        telephone: data.phone || '',
      },
      scope: null,
    });
  },
  async updateStatus(id, status) {
    return serviceAdministration.setStatus(id, status === 'ACTIVE' || status === 'actif' ? 'actif' : 'suspendu');
  },
};
