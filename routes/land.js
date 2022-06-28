const express = require("express");

const isAuth = require("../middleware/is-auth");
const isBusiness = require("../middleware/is-business");

const landController = require("../controllers/land");

const router = express.Router();

router.put("/:landId", isAuth, isBusiness, landController.updateLand);

router.post("/buy/:landId", isAuth, isBusiness, landController.buyLand);

router.get("/", landController.getLands);

module.exports = router;
