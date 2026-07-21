import {livraisonsFictives} from "@/données/livraisonsFictives.js";
import serviceNotification from "@/services/ServiceNotification.js";

let nextId = livraisonsFictives.length > 0 ? Math.max(...livraisonsFictives.map(d => d.id)) + 1 : 4;

export const serviceLivraison = {
    async getAll() {
        return livraisonsFictives;
    },

    async findAll() {
        return livraisonsFictives;
    },

    async findById(id) {
        return livraisonsFictives.find((delivery) => delivery.id === id);
    },

    async updateStatus(id, status) {
        const delivery = livraisonsFictives.find((delivery) => delivery.id === id);

        if (!delivery) {
            return null;
        }

        delivery.status = status;
        return delivery;
    },

    /**
     * Crée une nouvelle livraison (mock).
     * data attendu :
     * {
     *   reference: string,
     *   quantity: number,
     *   weight: number,
     *   type: string,
     *   date: string,
     *   relayPointId: number | string,
     *   relayPointName: string,
     *   comment?: string,
     *   commerceId?: string | number
     * }
     */
    async createDelivery(data) {
        const newDelivery = {
            id: nextId++,
            reference: data.reference || `COL-${String(nextId).padStart(4, "0")}`,
            quantity: data.quantity ?? 1,
            weight: data.weight ?? 0,
            type: data.type ?? "Standard",
            date: data.date ?? new Date().toISOString().slice(0, 10),

            relayPointId: data.relayPointId,
            relayPoint: data.relayPointName || "Point relais",

            comment: data.comment ?? "",
            commerceId: data.commerceId,

            status: "Créée",
            createdAt: new Date().toISOString(),
        };
        livraisonsFictives.push(newDelivery);
        await serviceNotification.create({
            title: "Nouvelle livraison",
            message: `La livraison ${newDelivery.reference} a été créée.`,
            type: "Livraison"
        });
        return newDelivery;
    },

    /**
     * Retourne les livraisons d'un commerçant (mock).
     */
    async getMyDeliveries(commerceId) {
        if (!commerceId) {
            return livraisonsFictives;
        }

        return livraisonsFictives.filter((delivery) => delivery.commerceId === commerceId);
    },
};

export default serviceLivraison;