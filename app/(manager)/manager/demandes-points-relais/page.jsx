import AccountDirectory from "@/composants/admin/AccountDirectory.jsx";
import RegistrationRequestsPanel from "@/composants/admin/RegistrationRequestsPanel.jsx";

export default function Page(){return <div className="space-y-10">
    <RegistrationRequestsPanel role="point_relais"/>
    <AccountDirectory role="point_relais" title="Comptes points relais" description="Consultez, suspendez ou réactivez les comptes points relais de votre périmètre."/>
</div>}
