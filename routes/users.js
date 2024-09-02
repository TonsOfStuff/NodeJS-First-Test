const express = require("express");
const app = express.Router();

app.get("/", (req, res) => {
    res.render("users.ejs")
})

module.exports = app;