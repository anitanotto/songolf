import spotify from "./controllers/spotify.js";

//Connect to Spotify
let token = await spotify.getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)

console.log(token)

token = token.access_token

console.log(token)

const ids = ["6UeSakyzhiEt4NB3UAd6NQ","2nxk7JE73agGuLDdbBjrAh"];

for (const id of ids) {
    const playlist = await spotify.getPlaylist(id, token);
    
    console.log(`Updating Playlist: "${playlist.formatted.name}"...`);

    const tables = spotify.parsePlaylistTables(playlist);
    
    await spotify.updatePlaylist(tables);

    console.log(`${playlist.formatted.name} updated!`);
};

console.log("Playlist update complete!");
