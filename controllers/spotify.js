export default {
    getToken: async (client_id, client_secret) => {
        const url = "https://accounts.spotify.com/api/token";
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + (Buffer.from(client_id + ":" + client_secret).toString("base64")),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials",
            json: true
        });

        if (res.ok) {
            const json = await res.json()
            return json
        } else {
            console.log(res.statusText);
            throw new Error(`Request failed! Status: ${res.status} ${res.statusText}`);
        }
    }
};
