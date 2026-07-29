import { apiRequest } from '@/services/api.js';

export const serviceRegistrationRequests = {
  async create(input) {
    const payload = await apiRequest('/api/v1/registration-requests', { method: 'POST', body: JSON.stringify(input) });
    return payload.data;
  },
  async list(filters = {}) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value !== undefined && value !== null && value !== '' && query.set(key, String(value)));
    const payload = await apiRequest(`/api/v1/registration-requests?${query.toString()}`);
    return payload.data || [];
  },
  async decide(id, action, comment = '') {
    const payload = await apiRequest(`/api/v1/registration-requests/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ action, comment }) });
    return payload.data;
  },
};
