"use client";


import {useEffect, useState} from "react";


import {serviceAuthentification} from "@/services/ServiceAuthentification.js";


export default function useUser() {


    const [user, setUser] = useState(null);


    const [loading, setLoading] = useState(true);


    useEffect(() => {
        serviceAuthentification
            .getCurrentUser()
            .then((data) => {
                setUser(data);
                setLoading(false);
            });

    }, []);
    return {user, loading};


}