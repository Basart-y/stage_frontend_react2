export default function ActionButton({children, onClick, color = "blue"}) {

    const colors = {
        blue: "bg-blue-600", green: "bg-green-600", red: "bg-red-600"
    };

    return (<button
            onClick={onClick}
            className={`${colors[color]} px-5 py-3 rounded-lg text-sm font-medium hover:opacity-90`}
        >
            {children}
        </button>);
}