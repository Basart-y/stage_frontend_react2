export default function LoginPage() {

    return (<main className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-semibold">
                    Connexion
                </h1>

                <p className="text-sm text-slate-400">
                    Choisissez un rôle pour accéder à l'espace correspondant.
                </p>


                <div className="space-y-2">


                    <RoleLink
                        href="/commercant/dashboard"
                        label="Espace Commerçant"
                    />


                    <RoleLink
                        href="/point-relais/dashboard"
                        label="Espace Point Relais"
                    />


                    <RoleLink
                        href="/manager/dashboard"
                        label="Espace Manager"
                    />
                    <RoleLink
                        href="/supermanager/dashboard"
                        label="Espace SuperManager"
                    />
                </div>
            </div>
        </main>

    );

}

function RoleLink({href, label}) {

    return (
        <a href={href} className="block w-full text-left px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700text-sm">
            {label}
        </a>);
}