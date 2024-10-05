const express = require("express");
const app = express.Router();

app.get("/", (req, res) => {
    res.render("loginPage.ejs", {sampData: res.username, isLogged: res.isLogged});
})

module.exports = app;