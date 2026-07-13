import { Bell, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate(); // Sert a changer de page , récupère la fonction

    return (
        <header className="p-4 lg:p-8 pb-0">
            <div className="rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] px-5 py-4 flex items-center justify-between gap-4">

                <div>
                    <h2 className="text-xl lg:text-2xl font-semibold">
                        Gestion des points relais
                    </h2>
                </div>

                <div className="flex items-center gap-3">

                    <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                        <Bell size={18} /> {/* Icone cloche */}
                    </button>

                    <button
                        onClick={() => navigate("/profil")} // Quand clique va à la page de profil grace a la fonction navigate (useNavigate)
                        className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 hover:bg-white/10 transition"
                    >
                        <CircleUserRound size={18} />
                        <span className="text-sm">Compte</span>
                    </button>

                </div>

            </div>
        </header>
    );
}