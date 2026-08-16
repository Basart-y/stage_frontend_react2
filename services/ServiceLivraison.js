import { apiRequest } from '@/services/api.js';

async function request(path, options = {}) {
  return (await apiRequest(path, options)).data;
}

export const serviceLivraison = {
  async createDelivery(data) { return request('/api/v1/deliveries', { method:'POST', body:JSON.stringify(data) }); },
  async getMyDeliveries() { return request('/api/v1/deliveries'); },
  async getForRelay() { return request('/api/v1/deliveries'); },
  async search(query) {
    const deliveries = await request('/api/v1/deliveries');
    const normalized = String(query || '').trim().toLowerCase();
    if (!normalized) return deliveries;
    return deliveries.filter(delivery => {
      const client = `${delivery.client?.firstName || ''} ${delivery.client?.lastName || ''}`;
      return `${delivery.reference} ${client} ${delivery.relayPoint || ''}`.toLowerCase().includes(normalized);
    });
  },
  async findById(id) { return request(`/api/v1/deliveries/${id}`); },
  async updateStatus(id, status, comment = '', extra = {}) { return request(`/api/v1/deliveries/${id}/transition`, { method:'POST', body:JSON.stringify({status,comment,...extra}) }); },
  async requestReturn(id, reason='') { return this.updateStatus(id,'Retour demandé',reason || 'Retour demandé par le commerçant.', {returnReason: reason || 'Retour demandé par le commerçant.'}); },
  async requestReturns(ids, reason='') { return Promise.all(ids.map(id => this.requestReturn(id, reason))); },
  getAllowedTransitions(status) {
    const map = {
      'Créée':['En transit','Arrivé au point relais','Refusé','Retour demandé'], 'En transit':['Arrivé au point relais','Refusé','Retour demandé'],
      'Arrivé au point relais':['Retiré','Retour demandé','Non récupéré'], 'Retour demandé':['Retourné'], 'Non récupéré':['Retour demandé','Retourné'],
      'Refusé':['Retour demandé','Retourné'], 'Retiré':[], 'Retourné':[],
    };
    return [...(map[status] || [])];
  },
  async receive(id, comment='') { return this.updateStatus(id,'Arrivé au point relais',comment || 'Colis réceptionné et entré en stock.'); },
  async refuse(id, reason) { return this.updateStatus(id,'Refusé',reason || 'Réception refusée.'); },
  async handoff(id, proof={}) { return request(`/api/v1/deliveries/${id}/transition`, { method:'POST', body:JSON.stringify({status:'Retiré',comment:`Colis remis à ${proof.recipientName || 'la personne identifiée'}.`,proof}) }); },
  async confirmReturn(id, reason='') { return this.updateStatus(id,'Retourné',reason || 'Retour physique confirmé par le point relais.'); },
  async getAll() { return request('/api/v1/deliveries'); },
};
export default serviceLivraison;
