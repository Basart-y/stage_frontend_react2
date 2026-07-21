export default function FiltresLivraisons({status,setStatus}) {

    return (
        <select
            value={status}
            onChange={(e) =>
                setStatus(
                    e.target.value
                )
            }
            className="
                rounded-lg
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
            "
        >
            <option value="">
                Tous les statuts
            </option>

            <option value="En transit">
                En transit
            </option>

            <option value="Arrivé au point relais">
                Arrivé au point relais
            </option>

            <option value="Retiré">
                Retiré
            </option>

            <option value="Retourné">
                Retourné
            </option>

        </select>
    );

}