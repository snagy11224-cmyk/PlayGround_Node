const express = require("express");
const router = express.Router(); //like a mini app
const userController = require("./controllers/user.controller");

router.post("/register",userController.register);

module.exports = router;    