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

//Connect to DB
const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

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
