import { createClient } from "@libsql/client";

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
            name: data.name,
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
                name: track.name,
                artists: formattedArtists,
                artistsAndName: `"${formattedArtists} - ${track.name}"`,
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
                        name: artist.name
                    });
                });
                
                count++;
            }
        }

        return res;
    },
    updatePlaylist: async (data) => {
        const client = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });

        const playlist = data.playlist[0];
        console.log(playlist)
        const tracks = data.tracks;
        const playlistTrack = data.playlistTrack;

        await client.execute(`INSERT INTO playlists VALUES ("${playlist.playlistId}", "${playlist.name}", "${playlist.imgSrc}")
        ON CONFLICT(playlistId)
        DO UPDATE SET name="${playlist.name}", 
                      imageSrc="${playlist.imageSrc}";`);

        for await (const track of tracks) {
            client.execute(`INSERT INTO tracks VALUES ("${track.trackId}", "${track.name}", "${track.artists}", "${track.artistsAndName}", "${track.imageSrc}", ${track.year}, ${track.popularity}")
            ON CONFLICT(trackId)
            DO UPDATE SET name="${track.name}",
                          artists="${track.artists}",
                          artistsAndName="${track.artistsAndName}",
                          imageSrc="${track.imageSrc}",
                          year=${track.year},
                          popularity=${track.popularity};`);
        };

        const numCurrentTracks = await client.execute().rows.length;
        const numNewTracks = tracks.length;

        if (numCurrentTracks > numNewTracks) {
            await console.execute(`DELETE FROM playlistTrack WHERE playlistId="${pt.playlistId}";`);
        }

        for await (const pt of playlistTrack) {
            client.execute(`INSERT INTO playlistTrack  VALUES("${pt.playlistTrackIndex}", "${pt.playlistId}", "${pt.trackId}")
            ON CONFLICT(playlistTrackIndex)
            DO UPDATE SET playlistId="${pt.playlistId}",
                          trackId="${pt.trackId}";`);
        };

    }
};
