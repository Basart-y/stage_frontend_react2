export default function PageTitle({title,description}){

    return (

        <div className="space-y-2">

            <h1 className="text-3xl font-semibold">
                {title}
            </h1>


            <p className="text-slate-400">
                {description}
            </p>


        </div>

    );

}