export default function Button({
                                   children, variant = "primary", size = "md", className = "", ...props
                               }) {
    const base = "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950";

    const variants = {
        primary: "bg-[#4F8CFF] text-white hover:bg-[#3f7df0] focus:ring-[#4F8CFF] shadow-[0_10px_30px_rgba(79,140,255,0.25)]",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 focus:ring-white/20",
        outline: "bg-transparent text-white border border-white/15 hover:bg-white/5 focus:ring-white/20",
        danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-[0_10px_30px_rgba(244,63,94,0.25)]",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm", md: "px-4 py-3 text-sm", lg: "px-5 py-3.5 text-base",
    };

    return (<button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
    </button>);
}