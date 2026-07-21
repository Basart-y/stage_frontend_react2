import {demandesCommercesFictive} from "@/données/demandesCommercesFictive.js";

import {serviceNotification} from "@/services/ServiceNotification.js";


export const serviceCommerce = {


    async createRequest(data) {


        const request = {
            id: Date.now(),
            userId: data.userId ?? 10,
            name: data.name,
            email: data.email,
            city: data.city,
            status: "PENDING"
        };


        demandesCommercesFictive.push(request);


        const managerId = 1;

        await serviceNotification.create({

            userId: managerId,
            role: "MANAGER",
            title: "Nouvelle demande commerçant",
            message: `${data.name} demande une inscription.`

        });
        return request;


    },


    async getRequests() {
        return demandesCommercesFictive;
    },


    async getById(id) {
        return demandesCommercesFictive.find(request => request.id == id);
    }


};