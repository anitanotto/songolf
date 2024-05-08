import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();

import ejs from "ejs";
import logger from "morgan";

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

//Setup routes for which the server is listening
app.use("/", mainRoutes);
app.use("/api", apiRoutes);

//Server Running
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
});

//Map client UUIDs to socket connections
const hub = {
    clients: new Map(),
    lobbies: new Map(),
    games: new Map()
};

const wsServer = new WebSocketServer({ "server": server, "path": "/ws" });
wsServer.on("connection", (ws, req) => {
    ws.send('Welcome to Songolf!')

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        console.log(`WS  / ${message.message} message recieved from UUID ${message.userId}`);
        songolfRouter(message, ws, hub);
    });

    ws.on('close', () => {
        //
    });
});
