export const statusLabels = {
    ACTIVE: "Actif", INACTIVE: "Inactif",

    ACCEPTED: "Accepté", REFUSED: "Refusé",

    ACTIF: "Actif", SUSPENDU: "Suspendu", INCIDENT: "Incident", MAINTENANCE: "Maintenance",

    IN_TRANSIT: "En transit", AVAILABLE: "Disponible", RECEIVED: "Reçu", RECU: "Reçu", RETIRED: "Retiré",

    PENDING: "En attente"
};

export function translateStatus(status) {

    const labels = {
        ACTIVE: "Actif", INACTIVE: "Inactif",

        PENDING: "En attente", ACCEPTED: "Accepté", REFUSED: "Refusé",

        VACATION: "En pause", INCIDENT: "Incident", SUSPENDED: "Suspendu",

        RECU: "Reçu", EN_TRANSIT: "En transit", RETIRE: "Retiré"
    };


    return labels[status] ?? status;

}