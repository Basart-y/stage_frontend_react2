import {apiRequest} from "./api";

export const servicePointRelais = {
    async search({
                     city = "", postalCode = ""
                 }) {
        const params = new URLSearchParams({
            city, postalCode
        });

        return await apiRequest(`/api/relay-points?${params.toString()}`);
    },

    async getAll() {
        return await apiRequest("/api/relay-points");
    },

    async findById(id) {
        const points = await this.getAll();

        return points.find((point) => point.id === id);
    }
};

export default servicePointRelais;