const express = require("express");
const bodyParser = require("body-parser");
const app = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); //Middleware for posting
app.use(express.urlencoded());

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

app.post("/", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;

    let query = `INSERT INTO users (Name, Username) VALUES ('${name}', '${username}')`
    db.query(query, (error, data) =>{
        if (error){
            throw error;
        }
    })

    res.redirect(303, "/users")
})

module.exports = app;