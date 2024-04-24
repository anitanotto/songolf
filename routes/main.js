import express from "express";
import homeController from "../controllers/home.js";
import apiController from "../controllers/api.js";

const router = express.Router();

//Main Routes
router.get("/", homeController.getIndex);
router.get("/home", homeController.getHome);
router.get("/navButton", homeController.getNavButton);
router.get("/profile", homeController.getProfile);


//API Routes
router.get("/api", apiController.getApi);

export default router;
