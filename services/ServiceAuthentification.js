import {currentUserMock} from "@/données/UtilisateurCourant.js";


export const serviceAuthentification = {


    async getCurrentUser() {
        return Promise.resolve(currentUserMock);

    },


    async logout() {
        console.log("Déconnexion");
        return true;
    }


};