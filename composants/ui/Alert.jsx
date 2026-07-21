export default function Alert({type = "success", message}) {
    const color = type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400";

    return (<div className={`rounded-lg p-4 ${color}`}>
            {message}
        </div>);
}