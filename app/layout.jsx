import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
    title: "Plateforme Points Relais", description: "Application de gestion de points relais et commerces"
};

export default function RootLayout({children}) {
    return (<html lang="fr">
    <body className="bg-slate-950 text-slate-100">
    {children}
    </body>
    </html>);
}