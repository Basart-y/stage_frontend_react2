"use client";


import {
    useEffect,
    useState
} from "react";


import PageTitle from "@/composants/ui/PageTitle";

import TableauDonnees from "@/composants/table/TableauDonnees.jsx";


import {
    serviceColis
} from "@/services/ServiceColis.js";



const statusLabel = {


    AVAILABLE:
        "Disponible pour retrait",


    RECU:
        "Remis au client"


};



export default function RemiseColisPage(){


    const [parcels,setParcels]=useState([]);



    useEffect(()=>{


        serviceColis
            .findAll()
            .then(setParcels);


    },[]);



    const available =
        parcels.filter(
            parcel =>
                parcel.status==="AVAILABLE"
        );



    return (

        <div className="space-y-8">


            <PageTitle

                title="Remise des colis"

                description="Validez la remise d'un colis au client."

            />



            <TableauDonnees


                columns={[


                    {

                        key:"reference",

                        label:"Colis"

                    },


                    {

                        key:"customer",

                        label:"Client"

                    },


                    {

                        key:"status",

                        label:"Etat",

                        render:(row)=>

                            statusLabel[row.status]
                            ||
                            row.status

                    },


                    {

                        key:"actions",

                        label:"Actions",

                        render:(row)=>(

                            <button

                                className="
                            text-green-400
                            underline
                            "

                                onClick={async()=>{


                                    await serviceColis.receive(
                                        row.id,
                                        {}
                                    );


                                    alert(
                                        "Colis remis au client"
                                    );


                                }}

                            >

                                Remettre

                            </button>

                        )

                    }


                ]}


                data={available}


            />


        </div>

    );


}