import { apiRequest } from '@/services/api.js';

const TOKEN_KEY = 'relayflow_access_token';
const USER_KEY = 'relayflow_current_user';

function roleHome(role) {
  return {
    commercant: '/commercant/dashboard',
    point_relais: '/point-relais/dashboard',
    gestionnaire: '/manager/dashboard',
    super_gestionnaire: '/supermanager/dashboard',
    gestionnaire_financier: '/finance/dashboard',
  }[role] || '/login';
}

export const serviceAuthentification = {
  async login(email, password) {
    const payload = await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const session = payload.data;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_KEY, session.accessToken);
      window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    }
    return { ...session, home: roleHome(session.user?.role) };
  },

  async getCurrentUser({ refresh = false } = {}) {
    if (typeof window === 'undefined') return null;
    if (!refresh) {
      try {
        const cached = JSON.parse(window.localStorage.getItem(USER_KEY) || 'null');
        if (cached) return cached;
      } catch {}
    }
    try {
      const payload = await apiRequest('/api/v1/auth/me');
      window.localStorage.setItem(USER_KEY, JSON.stringify(payload.data));
      return payload.data;
    } catch (error) {
      if (error.status === 401) this.logout();
      throw error;
    }
  },

  getCachedUser() {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(window.localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  },

  getHomeForRole: roleHome,

  logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
    return true;
  },
};
