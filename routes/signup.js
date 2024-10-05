const express = require("express");
const argon = require("argon2");
const bodyParser = require("body-parser");
const app = express.Router();

const {jwtAlrLoggedNoAgain} = require("./users")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); //Middleware for posting
app.use(express.urlencoded({ extended: true }));

const db = require("../models/database")

app.get("/", jwtAlrLoggedNoAgain, (req, res) => {
    res.render("signup.ejs")
})

app.post ("/", async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const securePass = await argon.hash(password);

    //Insert user into user table
    let query = `INSERT INTO users (Name, Username) VALUES ('${name}', '${username}')`
    db.query(query, (error) =>{
        if (error){
            throw error;
        }
    })

    //Insert encodedPass to seperate table
    query = `INSERT INTO encodedPass (username, password_hash) VALUES ('${username}', '${securePass}')`
    db.query(query, (error) => {
        if (error){
            throw error;
        }
    })

    res.redirect(303, "/users")
})

module.exports = app;