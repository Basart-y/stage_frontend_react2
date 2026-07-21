import {abonnementsFictifs} from "@/données/abonnementsFictifs.js";

let currentSubscription = abonnementsFictifs[0];

const serviceAbonnement = {
    async getCurrentSubscription() {
        return currentSubscription;
    },

    async getSubscriptions() {
        return abonnementsFictifs;
    },

    async createSubscription(subscription) {
        currentSubscription = {
            ...subscription, status: "Actif", createdAt: new Date().toISOString()
        };

        return currentSubscription;
    },

    async cancelSubscription() {
        if (!currentSubscription) {
            return null;
        }

        currentSubscription.status = "Résilié";

        return currentSubscription;
    }
};

export default serviceAbonnement;