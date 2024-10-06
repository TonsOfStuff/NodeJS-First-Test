const express = require("express");
const app = express.Router();

const {jwtMiddleWareHome} = require("./users")



app.get("/", jwtMiddleWareHome, (req, res) => {
    res.render("loginPage.ejs", {sampData: req.session.results, isLogged: res.isLogged});
})

module.exports = app;