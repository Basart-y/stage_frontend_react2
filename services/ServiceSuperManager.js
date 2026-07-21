import {managersMock} from "@/données/managers";

export const serviceSuperManager = {

    async getManagers() {
        return managersMock;
    },


    async getManagerById(id) {

        return managersMock.find(manager => manager.id == id);

    },


    async createManager(data) {

        const manager = {
            id: Date.now(),
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            phone: data.phone,
            city: data.city,
            sector: data.sector,
            status: "ACTIVE"
        };


        managersMock.push(manager);


        return manager;

    },


    async updateStatus(id, status) {

        const manager = managersMock.find(manager => manager.id == id);


        if (!manager) {
            return null;
        }


        manager.status = status;


        return manager;

    }

};