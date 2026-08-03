import "./globals.css";

export const metadata = {
    title: "",
    description: "Plateforme B2B de gestion de livraisons et points relais",
};

export default function RootLayout({children}) {
    return (<html lang="fr">
    <body className="bg-slate-50 text-slate-900 antialiased">
    {children}
    </body>
    </html>);
}
