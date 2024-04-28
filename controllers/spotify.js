import { writeFileSync } from "node:fs";

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
        
        data.formatted =  {
            playlistId: data.id,
            name: csvEncode(data.name),
            imageSrc: data.images.at(-1)?.url ?? null,
        }

        return data
    },
    parsePlaylistTables: (playlist) => {
        const res =  {
            playlist: [playlist.formatted],
            playlistTrack: [],
            tracks: [],
            artistTrack: [],
            artists: []
        };

        let count = 0;

        for (const item of playlist.tracks.items) {
            const track = item.track;
            const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
            const formattedArtists = artists.map((a) => a.name).join(", ");

            const formattedTrack = {
                trackId: track.id,
                previewUrl: track.preview_url,
                name: csvEncode(track.name),
                artists: csvEncode(formattedArtists),
                artistsAndName: csvEncode(`${formattedArtists} - ${track.name}`),
                imageSrc: track.album.images.at(-1)?.url ?? null,
                year: Number(track.album.release_date.split('-')[0]),
                popularity: track.popularity
            };
            
            if (formattedTrack.previewUrl) {
                res.tracks.push(formattedTrack);

                res.playlistTrack.push({
                    playlistTrackIndex: playlist.formatted.playlistId + "-" + count,
                    playlistId: playlist.formatted.playlistId,
                    trackId: formattedTrack.trackId
                });
            
                artists.forEach(artist => {
                    res.artistTrack.push({
                        artistId: artist.id,
                        trackId: formattedTrack.trackId
                    });

                    res.artists.push({
                        artistId: artist.id,
                        name: csvEncode(artist.name)
                    });
                });
                
                count++;
            }
        }

        return res;
    },
    formatTableAsCsv: (name, table) => {
        let res = "";

        res += Object.keys(table[0]).join(",") + "\n";

        for (const row of table) {
            res += Object.values(row).join(",") + "\n";
        }
        
        writeFileSync(`./csv/${name}.csv`, res);

        return res;
    }
};


function csvEncode(s) {
    let res = '"';

    for (const c of s) {
        if (c === '"') {
            res += '""';
        } else {
            res += c;
        }
    }

    res += '"';

    return res;
}
