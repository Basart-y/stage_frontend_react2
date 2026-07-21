const API_TIMEOUT = 10000;


export async function apiRequest(url, options = {}) {

    const controller = new AbortController();


    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);


    try {


        const response = await fetch(url, {
            ...options, signal: controller.signal
        });


        clearTimeout(timeout);


        if (!response.ok) {

            throw new Error(`Erreur HTTP ${response.status}`);

        }


        return await response.json();


    } catch (error) {


        clearTimeout(timeout);


        console.error(error);


        throw error;


    }

}