import express from "express";
import apiController from "../controllers/api.js";

const router = express.Router();

router.get("/dummy", function() { return 'dummy' });

export default router;
