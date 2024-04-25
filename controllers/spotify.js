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
    },
    getPlaylist: async (playlist_id, access_token) => {
        const url = `https://api.spotify.com/v1/playlists/${playlist_id}`
        const headers = { "Authorization": `Bearer ${access_token}` };
        const res = await fetch(url, { headers });
        const data = await res.json()
        return data
    },
    parsePlaylist: async (playlist) => {
        const res = [];

        for (const item of playlist.tracks.items) {
            const track = item.track;
            const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
            const formattedArtists = artists.map((a) => a.name).join(", ");


            res.push({
                artists: {
                    list: artists,
                    formatted: formattedArtists
                },
                formatted: `${formattedArtists} - ${track.name}`,
                id: track.id,
                imgSrc: track.album.images.at(-1)?.url ?? null,
                name: track.name,
                year: Number(track.album.release_date.split('-')[0]),
                previewUrl: track.preview_url,
                popularity: track.popularity
            });
        }

        return res;
    }
};
