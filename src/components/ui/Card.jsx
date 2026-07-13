export default function Card({ children, className = "" }) {
    return (
        <div className={`rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${className}`}>
            {children}
        </div>
    );
}

{/*Conteneur qui sert à avoir le même style de carte, définit un cadre */}