const express = require("express");
const register = require("./register");
const login = require("./login");
const editUserView = require("./editUserView");
const rasatesting = require("./rasatesting");
const rasatesting2 = require("./rasatesting2");
const insertSign = require("./insertSign");
const router = express.Router();

router.post("/register", register)
router.post("/editUserView", editUserView)
router.post("/login", login)
router.post("/rasatesting", rasatesting);
router.post("/rasatesting2", rasatesting2)
router.post("/insertSign", insertSign)

module.exports = router; 