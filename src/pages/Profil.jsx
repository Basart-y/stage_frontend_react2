import {useState} from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function Profil() {

    const [modifier, setModifier] = useState(false);

    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <h1 className="text-3xl font-semibold">Profil utilisateur</h1>
                <p className="mt-2 text-sm text-slate-400">
                    Consultez vos informations personnelles.
                </p>
            </Card>

            <Card className="p-6">

                <div className="grid gap-5 lg:grid-cols-2">
                    <Input label="Nom" value="Dupont" disabled={!modifier}/>
                    <Input label="Prénom" value="Jean" disabled={!modifier}/>
                    <Input label="Email" value="jean.dupont@mail.com" disabled={!modifier}/>
                    <Input label="Téléphone" value="06 12 34 56 78" disabled={!modifier}/>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={() => setModifier(!modifier)}>
                        {modifier ? "Enregistrer" : "Modifier"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}