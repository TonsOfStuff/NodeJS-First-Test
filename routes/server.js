const express = require('express');
const router = express.Router();

const {jwtMiddleWare} = require("./users")

router.get("/", jwtMiddleWare, (req, res) => {
    res.render("mainPage.ejs");
})


module.exports = router;