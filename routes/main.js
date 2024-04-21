const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const apiController = require("../controllers/api");

router.get("/", homeController.getIndex);
router.get("/api", apiController.getApi);

module.exports = router;
