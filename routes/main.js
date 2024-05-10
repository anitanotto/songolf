import express from "express";
import homeController from "../controllers/home.js";
import apiController from "../controllers/api.js";

const router = express.Router();

//Main Route
router.get("/", homeController.getIndex);

//HTMX Routes
router.get("/home", homeController.getHome);
router.get("/navButton", homeController.getNavButton);
router.get("/profile", homeController.getProfile);

//API Routes
router.get("/api", apiController.getApi);

export default router;
