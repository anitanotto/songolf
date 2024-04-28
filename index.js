import express from "express";
const app = express();

import { createClient } from "@libsql/client";
import spotify from "./controllers/spotify.js";
import logger from "morgan";

import mainRoutes from "./routes/main.js";
import apiRoutes from "./routes/api.js";

//Connect to Spotify
const token = await spotify.getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)
console.table(token)

const playlist = await spotify.getPlaylist("6UeSakyzhiEt4NB3UAd6NQ", token.access_token);

const tables = spotify.parsePlaylistTables(playlist)

for (const key of Object.keys(tables)) {
    console.log(key)
    //if (key !== 'playlist') console.log(spotify.formatTableAsCsv(tables[key]))
    //if (key !== 'playlist') {
        spotify.formatTableAsCsv(key, tables[key])
    //}
    console.log('done')
}


//Connect to DB
const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});


//console.log('insert row')
//await client.execute(`INSERT INTO playlists VALUES ("6UeSakyzhiEt4NB3UAd6NQ", "Billboard Hot 100", "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da843bd5501a335b265807df34db");`)
//console.log('inserted')

//Use EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Is this needed with HTMX??
//app.use(methodOverride("_method"));

//Setup routes for which the server is listening
app.use("/", mainRoutes);
app.use("/api", apiRoutes);

//Server Running
app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
});
