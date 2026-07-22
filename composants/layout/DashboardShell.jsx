"use client";

import UserHeader from "./UserHeader";

export default function DashboardShell({title, sidebar, children}) {

    return (<div className="min-h-screen bg-slate-950 text-slate-100">
            <UserHeader role={title}/>
            <div className="flex">
                <aside className="hidden md:block w-64 border-r border-slate-800 bg-slate-900 min-h-[calc(100vh-64px)]">
                    <div className="p-6">
                        {sidebar}
                    </div>
                </aside>
                <main className="flex-1">
                    <div
                        className="border-b border-slate-800 bg-slate-900 px-8 py-6">
                        <h1 className="text-3xl font-bold">
                            {title}
                        </h1>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>);
}