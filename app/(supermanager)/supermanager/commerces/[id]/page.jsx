"use client";


import {
    useState
} from "react";


import {
    useParams
} from "next/navigation";


import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";



const shops = [


    {
        id:1,
        name:"Boutique Provence",
        type:"PHYSICAL",
        status:"ACTIVE",
        city:"Istres",
        email:"contact@boutiqueprovence.fr",
        phone:"0600000000"
    },


    {
        id:2,
        name:"E-Shop",
        type:"ECOMMERCE",
        status:"ACTIVE",
        city:"Marseille",
        email:"contact@eshop.fr",
        phone:"0611111111"
    },


    {
        id:3,
        name:"Producteur Local",
        type:"PRODUCTEUR",
        status:"PENDING",
        city:"Aix-en-Provence",
        email:"contact@producteur.fr",
        phone:"0622222222"
    }


];




const typeLabels = {

    PHYSICAL:"Commerce physique",

    ECOMMERCE:"E-commerce",

    PRODUCTEUR:"Producteur",

    MOBILE:"Marchand mobile"

};



const statusLabels = {


    ACTIVE:"Actif",

    PENDING:"En attente",

    SUSPENDED:"Suspendu",

    REFUSED:"Refusé"

};



export default function ShopDetailPage(){


    const params = useParams();



    const shop =
        shops.find(
            item =>
                item.id == params.id
        );



    const [status,setStatus] =
        useState(
            shop?.status
        );



    if(!shop){

        return (
            <div>
                Commerce introuvable
            </div>
        );

    }



    return (


        <div className="space-y-8">


            <PageTitle

                title={shop.name}

                description="Détails du commerce."

            />





            <Section title="Informations commerce">


                <div className="space-y-3">


                    <p>
                        <b>Nom :</b> {shop.name}
                    </p>


                    <p>
                        <b>Type :</b>{" "}
                        {typeLabels[shop.type]}
                    </p>


                    <p>
                        <b>Ville :</b> {shop.city}
                    </p>


                    <p>
                        <b>Email :</b> {shop.email}
                    </p>


                    <p>
                        <b>Téléphone :</b> {shop.phone}
                    </p>


                </div>


            </Section>






            <Section title="Etat du commerce">


                <select

                    value={status}

                    onChange={(e)=>
                        setStatus(e.target.value)
                    }


                    className="
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-lg
                    px-4
                    py-3
                    "

                >

                    <option value="ACTIVE">
                        Actif
                    </option>


                    <option value="PENDING">
                        En attente
                    </option>


                    <option value="SUSPENDED">
                        Suspendu
                    </option>


                    <option value="REFUSED">
                        Refusé
                    </option>


                </select>



                <p className="mt-4 text-slate-400">

                    Etat actuel :
                    {" "}
                    {statusLabels[status]}

                </p>




                <button

                    className="
                    mt-5
                    rounded-lg
                    bg-green-600
                    px-5
                    py-3
                    "

                    onClick={()=>{

                        alert(
                            "Etat du commerce modifié (mock)"
                        );

                    }}

                >

                    Enregistrer

                </button>



            </Section>



        </div>


    );


}