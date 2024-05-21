import ejs from "ejs";
import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function sendLoading(type, socket, message) {
    const html = await ejs.renderFile(`./views/components/loading${type}.ejs`, { message: message });
    socket.send(html);
}

export default {
    connect: async (message, socket, hub) => {
        // Check if message.userID is in DB or hub.clients
        // If not, send sign up form and tutoral info

        // Check if user is in an existing lobby or game
        // Send them that lobby or game if they are

        //Otherwise
        await sendLoading("Message", socket, "Connected!");
        hub.clients.set(message.userId, socket);
        const html = await ejs.renderFile("./views/components/home.ejs");
        socket.send(html);
    },
    register: async (message, socket, hub) => {
        //Let new users set their username, send error if name exists in db
    },
    getLobbies: async (message, socket, hub) => {
        const html = await ejs.renderFile("./views/components/lobbies.ejs", { lobbies: hub.lobbies });
        socket.send(html);
    },
    createSoloGame: async (message, socket, hub) => {
        const html = await ejs.renderFile("./views/components/gameOptions.ejs", { mode: "solo", playlists: hub.playlists });
        socket.send(html);
    },
    createMultiGame: async (message, socket, hub) => {
        const html = await ejs.renderFile("./views/components/gameOptions.ejs", { mode: "multi", playlists: hub.playlists });
        socket.send(html);
    },
    joinLobby: (message, socket, hub, index) => {
        if (index === undefined) {
            //If player is creating a new lobby
            const playlist = hub.playlists.get(message.playlist).name
            hub.lobbies.set(message.userId, { username: "test", playlistName: playlist })
            console.log(message)
        } else {
            //If player is joining an existing lobby
        }
    },
    leaveLobby: (message, socket, hub) => {

    },
    readyUp: (message, socket, hub) => {

    },
    unready: (message, socket, hub) => {

    },
    startGame: (message, socket, hub) => {
        console.log(message)

        if (message.solo === "true") {
            //If player is starting a solo game

        } else {
            //If lobby is starting a vs game

        }
    }
}
