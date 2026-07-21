import PageTitle from "@/composants/ui/PageTitle";

import TableauDonnees from "@/composants/table/TableauDonnees.jsx";


const logs = [


    {
        id: 1,

        action: "Création manager",

        date: "19/07/2026"

    },


    {
        id: 2,

        action: "Validation commerce",

        date: "18/07/2026"

    }


];


export default function JournalPage() {


    return (

        <div className="space-y-8">


            <PageTitle

                title="Journal activité"

                description="
Historique des actions.
"

            />


            <TableauDonnees

                columns={[

                    {
                        key: "action", label: "Action"
                    },

                    {
                        key: "date", label: "Date"
                    }

                ]}


                data={logs}


            />


        </div>

    );


}