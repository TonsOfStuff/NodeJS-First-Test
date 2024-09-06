const express = require("express");
const bodyParser = require("body-parser");
const app = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); //Middleware for posting
app.use(express.urlencoded({ extended: true }));

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

app.post("/submit", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        console.log("Username or password not provided");
        return res.status(400).send("Username and password are required");
    }

    const query = "SELECT * FROM users";
    db.query(query, (error, data) => {
        if (error) {
            console.error("Database query error: ", error);
            return res.status(500).send("Internal server error");
        }

        const user = data.find(element => element.Username === username && element.password === password);
        if (user) {
            console.log("Log in successful");
            return res.render("mainPage.ejs"); 
        } else {
            console.log("Failed Log In");
            return res.status(401).send("Login failed: invalid username or password");
        }
    });
});

app.post("/", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    let query = `INSERT INTO users (Name, Username, Password) VALUES ('${name}', '${username}', '${password}')`
    db.query(query, (error) =>{
        if (error){
            throw error;
        }
    })

    res.redirect(303, "/users")
})

module.exports = app;