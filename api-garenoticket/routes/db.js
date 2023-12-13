const express = require("express");

const seedController = require("../controllers/dbController");

const router = express.Router();

router.get("/db/seed", seedController.seed );

module.exports = router;