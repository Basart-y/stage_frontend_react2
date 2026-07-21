import {demandesCommercesFictive} from "@/données/demandesCommercesFictive.js";
import {serviceNotification} from "@/services/ServiceNotification.js";

export const serviceManager = {
    async getShopRequests() {
        return demandesCommercesFictive;
    },

    async getShopRequestById(id) {
        return demandesCommercesFictive.find((request) => request.id == id);
    },

    async validateShop(id, accepted) {
        const request = demandesCommercesFictive.find((request) => request.id == id);

        if (!request) {
            return null;
        }

        request.status = accepted ? "ACCEPTED" : "REFUSED";

        await serviceNotification.create({
            userId: request.userId,
            role: "COMMERCANT",
            title: accepted ? "Commerce validé" : "Commerce refusé",
            message: accepted ? "Votre demande commerce a été acceptée." : "Votre demande commerce a été refusée."
        });

        return request;
    },

    async getRelayRequests() {
        return [];
    },

    async updateRelayStatus(id, status) {
        console.log("Modification point relais", id, status);

        return {
            id, status
        };
    }
};