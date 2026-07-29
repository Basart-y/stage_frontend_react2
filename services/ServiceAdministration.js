import { apiRequest } from '@/services/api.js';

const roleLabels = {
  commercant: 'Commerçant',
  point_relais: 'Point de relais',
  gestionnaire: 'Gestionnaire',
  super_gestionnaire: 'Super gestionnaire',
  gestionnaire_financier: 'Gestionnaire financier',
};

function normalize(user) {
  const profile = user?.profile || {};
  return {
    ...user,
    name: profile.raisonSociale || profile.nom || profile.nomCommerce || [profile.prenom, profile.nomFamille].filter(Boolean).join(' ') || user.email,
    city: profile.ville || '',
    departement: profile.departement || '',
    status: user.statutCompte,
    roleLabel: roleLabels[user.role] || user.role,
  };
}

export const serviceAdministration = {
  async listUsers(filters = {}) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
    });
    const payload = await apiRequest(`/api/v1/users?${query.toString()}`);
    return (payload.data || []).map(normalize);
  },

  async inviteUser(input) {
    const payload = await apiRequest('/api/v1/users/invite', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return {
      ...payload.data,
      user: normalize(payload.data?.user || {}),
    };
  },

  async setStatus(id, statutCompte) {
    const payload = await apiRequest(`/api/v1/users/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ statutCompte }),
    });
    return normalize(payload.data);
  },

  async getUser(id) {
    const payload = await apiRequest(`/api/v1/users/${encodeURIComponent(id)}`);
    return normalize(payload.data);
  },

  async updateUser(id, patch) {
    const payload = await apiRequest(`/api/v1/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return normalize(payload.data);
  },
};
