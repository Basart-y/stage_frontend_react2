import {Link} from "react-router-dom";
import {ArrowLeft, Eye, EyeOff, Lock} from "lucide-react";
import {useState} from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,140,255,0.22),transparent_35%),radial-gradient(circle_at_right,rgba(34,211,238,0.10),transparent_28%),linear-gradient(180deg,#08111f_0%,#0b1628_100%)]"/>
            <div
                className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]"/>

            <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
                <div
                    className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-white/10 bg-white/5 backdrop-blur-xl">
                    <div>
                        <Link to="/"
                              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
                            <ArrowLeft size={16}/>
                            Retour à l'accueil
                        </Link>
                        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-slate-400">Point Relais+</p>
                        <h1 className="mt-5 max-w-xl text-4xl xl:text-5xl font-semibold leading-tight">
                            Gérez vos points relais, colis et demandes dans une seule interface.
                        </h1>
                    </div>


                </div>

                <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
                    <Card className="w-full max-w-xl p-6 sm:p-8 bg-white/8 border-white/12">
                        <h2 className="mt-1 text-3xl font-semibold text-center">
                            Connexion
                        </h2>

                        <form className="space-y-5">
                            <Input label="Adresse email" type="email" placeholder="exemple@mail.com"/>
                            <label className="block space-y-2">
                                <span className="text-sm text-slate-300">Mot de passe</span>
                                <div
                                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <Lock size={16} className="text-slate-400"/>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                                    />
                                    <button type="button" onClick={() => setShowPassword((v) => !v)}
                                            className="text-slate-400 hover:text-white"
                                            aria-label="Afficher le mot de passe">
                                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </label>

                            <div className="flex items-center justify-between text-sm text-slate-400">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-white/20 bg-transparent"/>
                                    Se souvenir de moi
                                </label>
                                <button type="button" className="hover:text-white">Mot de passe oublié ?</button>
                            </div>

                            <Button className="w-full">Se connecter</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}