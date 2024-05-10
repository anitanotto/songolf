import ejs from "ejs";
import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default {
    connect: async (message, socket, hub) => {
        // Check if message.userID is in DB or hub.clients
        // If not, send sign up form and tutoral info

        // Check if user is in an existing lobby or game
        // Send them that lobby or game if they are

        //Otherwise
        hub.clients.set(message.userId, socket);
        const res = await ejs.renderFile("./views/components/home.ejs");
        socket.send(res);
    },
    getLobbies: async (message, socket, hub) => {
        const lobbies = null;
        const res = await ejs.renderFile("./views/components/lobbies.ejs", { lobbies: lobbies });
        socket.send(res);
    },
    createSoloGame: (message, socket, hub) => {

    },
    createMultiGame: (message, socket, hub) => {

    },
    joinLobby: (message, socket, hub) => {

    },
    readyUp: (message, socket, hub) => {

    },
    startGame: (message, socket, hub) => {

    }
}
