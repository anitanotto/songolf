import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();

import ejs from "ejs";
import logger from "morgan";

import { createClient } from "@libsql/client";

import mainRoutes from "./routes/main.js";
import apiRoutes from "./routes/api.js";
import songolfRouter from "./routes/songolf.js";

//Use EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));


//DB Connection
const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

//Setup routes for which the server is listening
app.use("/", mainRoutes);
app.use("/api", apiRoutes);

//Setup game data for server
const hub = {
    clients: new Map(),
    lobbies: new Map(),
    games: new Map(),
    playlists: new Map()
};

const playlists = await client.execute("SELECT * FROM playlists");

for (const playlist of playlists.rows) {
    hub.playlists.set(playlist.playlistId, playlist);
}
console.log(hub.playlists)

//Server Running
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
});

//Upgrade http server to socket
const wsServer = new WebSocketServer({ "server": server, "path": "/ws" });
wsServer.on("connection", (ws, req) => {
    ws.send('Welcome to Songolf!')

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        // If message.includes "-" split by it
        // extra parameter i after - for indexing games and lobbies
        console.log(`WS  / ${message.message} message recieved from UUID ${message.userId}`);
        if (message.message.includes("-")) {
            const split = message.message.split("-");
            message.message = split[0];
            const index = split[1];

            console.log("splitting " + split)
            songolfRouter(message, ws, hub, index);
        } else {
            songolfRouter(message, ws, hub);
        }
    });

    ws.on('close', () => {
        //
    });
});
