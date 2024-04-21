const express = require("express");
const app = express();

const logger = require("morgan");

const mainRoutes = require("./routes/main");
const apiRoutes = require("./routes/api");

//Pathing to .env
require("dotenv").config({ path: "./config/.env" });

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
