import { createClient } from "@libsql/client";

//Connect to DB
const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default {
    getApi: () => { }
};
