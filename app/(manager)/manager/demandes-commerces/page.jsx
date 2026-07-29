import AccountDirectory from "@/composants/admin/AccountDirectory.jsx";
import RegistrationRequestsPanel from "@/composants/admin/RegistrationRequestsPanel.jsx";

export default function Page(){return <div className="space-y-10">
    <RegistrationRequestsPanel role="commercant"/>
    <AccountDirectory role="commercant" title="Comptes commerçants" description="Consultez, suspendez ou réactivez les comptes commerçants de votre périmètre."/>
</div>}
