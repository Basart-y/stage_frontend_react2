import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

import LeafletFix from "./LeafletFix";

export default function ContenuCartePointsRelais({
                                            relayPoints = [], selected, onSelect
                                        }) {
    const validPoints = relayPoints.filter((relay) => relay.latitude && relay.longitude);
    console.log(relayPoints[0]);
    if (validPoints.length === 0) {
        return (
            <div className="h-[400px] rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center">
                <p className="text-slate-400">
                    Aucun point relais géolocalisé.
                </p>
            </div>);
    }

    const center = [validPoints[0].latitude, validPoints[0].longitude];

    return (<>
            <LeafletFix/>

            <MapContainer
                center={center}
                zoom={12}
                className="h-[400px] rounded-xl"
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validPoints.map((relay) => (<Marker
                        key={relay.id}
                        position={[relay.latitude, relay.longitude]}
                        eventHandlers={{
                            click: () => {
                                onSelect?.(relay);
                            }
                        }}
                    >
                        <Popup>
                            <strong>
                                {relay.name}
                            </strong>

                            <br/>

                            {relay.address}
                        </Popup>
                    </Marker>))}

            </MapContainer>
        </>);
}