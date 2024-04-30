import spotify from "./controllers/spotify.js";

//Connect to Spotify
const token = await spotify.getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)

const ids = [];

for (const id of ids) {
    const playlist = await spotify.getPlaylist(id, token);
    
    console.log(`Updating Playlist: "${playlist.formatted.name}"...`);

    const tables = spotify.parsePlaylistTables(playlist);
    
    await spotify.updatePlaylist(tables);

    console.log(`${playlist.formatted.name} updated!`);
};

console.log("Playlist update complete!");
