import {parcelsMock} from "@/données/colis.js";

export const serviceColis = {
    async findAll() {
        return parcelsMock;
    },

    async findById(id) {
        return parcelsMock.find((parcel) => parcel.id == id);
    },

    async receive(id, data) {
        const parcel = parcelsMock.find((parcel) => parcel.id == id);

        if (!parcel) {
            return null;
        }

        parcel.status = "RECU";
        parcel.received = true;
        parcel.comment = data.comment || "";

        return parcel;
    },

    async returnParcel(id, data) {
        const parcel = parcelsMock.find((parcel) => parcel.id == id);

        if (!parcel) {
            return null;
        }

        parcel.status = "RETOUR";
        parcel.returned = true;
        parcel.returnReason = data.reason || "";

        return parcel;
    }
};

export default serviceColis;
