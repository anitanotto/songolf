const express = require("express");
const app = express();

const { createClient } = require("@libsql/client");
const logger = require("morgan");

const mainRoutes = require("./routes/main");
const apiRoutes = require("./routes/api");

//Pathing to .env
require("dotenv").config({ path: "./config/.env" });

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
