import {apiRequest} from "./api";

export const servicePointRelais = {
    async search({city = "", postalCode = "", department = ""} = {}) {
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (postalCode) params.set('postalCode', postalCode);
        if (department) params.set('department', department);
        return (await apiRequest(`/api/v1/relay-points?${params.toString()}`)).data;
    },
    async getAll() { return (await apiRequest("/api/v1/relay-points?openOnly=false")).data; },
    async findById(id) {
        const points = await this.getAll();
        return points.find((point) => String(point.id) === String(id));
    },
    async getMyProfile() { return (await apiRequest('/api/v1/relay-points/me')).data; },
    async saveMyProfile(profile) { return (await apiRequest('/api/v1/relay-points/me', {method:'PATCH', body:JSON.stringify(profile)})).data; },
};

export default servicePointRelais;
