const express = require("express");

const isAuth = require("../middleware/is-auth"); //add as middleware in router methods
const userController = require("../controllers/user");

const router = express.Router();

router.get("/details", isAuth, userController.getUserDetails);

module.exports = router;
