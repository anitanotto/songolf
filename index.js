import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();

import logger from "morgan";

import mainRoutes from "./routes/main.js";
import apiRoutes from "./routes/api.js";

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
const clients = new Map();
const lobbies = new Map();
const games = new Map();

const wsServer = new WebSocketServer({ "server": server });
wsServer.on("connection", (ws, req) => {

    ws.send('welcome')

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        console.log(`${message.message} socket request from ${message.uuid}`)
        if (message.message === "connect") {
            clients.set(message.uuid, ws)
        }
    });

    ws.on('close', () => {
        console.log('closed')
    });
});
