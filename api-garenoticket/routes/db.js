const express = require("express");

const seedController = require("../controllers/dbController");

const router = express.Router();

// Permet de faire la bd
router.get("/db/seed", seedController.seed );

module.exports = router;