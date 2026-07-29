export const statusLabels = {
    ACTIVE: "Actif",
    ACTIF: "Actif",
    INACTIVE: "Inactif",
    PENDING: "En attente",
    ACCEPTED: "Accepté",
    REFUSED: "Refusé",
    VACATION: "En pause",
    EN_CONGES: "En congés",
    INCIDENT: "Incident",
    SUSPENDED: "Suspendu",
    SUSPENDU: "Suspendu",
    MAINTENANCE: "Maintenance",
    IN_TRANSIT: "En transit",
    EN_TRANSIT: "En transit",
    AVAILABLE: "Disponible",
    RECEIVED: "Reçu",
    RECU: "Reçu",
    RETIRED: "Retiré",
    RETIRE: "Retiré",
};

export function translateStatus(status) {
    return statusLabels[status] ?? status ?? "—";
}
