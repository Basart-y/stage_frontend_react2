export default function GrillesStatistiques({

                                      stats

                                  }){


    return (

        <div className="
grid
md:grid-cols-4
gap-4
">


            {

                stats.map(
                    (stat)=>(


                        <div

                            key={stat.label}

                            className="
rounded-xl
border
border-slate-800
bg-slate-900
p-5
"

                        >


                            <p className="text-sm text-slate-400">

                                {stat.label}

                            </p>


                            <p className="text-3xl font-semibold">

                                {stat.value}

                            </p>


                        </div>


                    )

                )


            }


        </div>

    );


}