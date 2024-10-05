const express = require('express');
const router = express.Router();

const {jwtMiddleWareHome} = require("./users")

router.get("/", jwtMiddleWareHome, (req, res) => {
    res.render("mainPage.ejs", {isLogged: req.isLogged});
})


module.exports = router;