const express = require("express");
const app = express.Router();
const db = require("../models/database")

app.get("/", (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (error, data) => {
        if (error){
            throw error;
        }else{
            res.render("users.ejs", {title:"Node.js App Test", action: "list", sampData: data});
        }
    });
})

module.exports = app;