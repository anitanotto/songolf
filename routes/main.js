const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const apiController = require("../controllers/api");

//Main Routes
router.get("/", homeController.getIndex);
router.get("/home", homeController.getHome);
router.get("/navButton", homeController.getNavButton);
router.get("/profile", homeController.getProfile);


//API Routes
router.get("/api", apiController.getApi);

module.exports = router;
