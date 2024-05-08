import ejs from "ejs";
import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default {
    connect: async (message, socket, hub) => {
        hub.clients.set(message.userId, socket);
        const res = await ejs.renderFile("./views/components/home.ejs");
        socket.send(res);
    }
}
