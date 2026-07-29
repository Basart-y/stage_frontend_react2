import {pointsRelaisFictifs} from "@/donnees/pointsRelaisFictifs.js";

export async function GET(request) {

    const {searchParams} = new URL(request.url);
    const city = searchParams.get("city") || "";
    const postalCode = searchParams.get("postalCode") || "";
    const points = pointsRelaisFictifs.filter((point) => {
        const matchCity = !city || point.city
            .toLowerCase()
            .includes(city.toLowerCase());
        const matchPostal = !postalCode || point.postalCode === postalCode;
        return matchCity && matchPostal;
    });
    return Response.json(points);
}


export async function PUT(request) {

    const body = await request.json();
    const relay = pointsRelaisFictifs.find((point) => point.id == body.id);
    if (!relay) {

        return Response.json({
            error: "Point relais introuvable"
        }, {
            status: 404
        });

    }
    relay.status = body.status;
    return Response.json(relay);

}