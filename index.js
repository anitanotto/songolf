import express from "express";
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
app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
});
