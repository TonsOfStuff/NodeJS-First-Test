const express = require("express");
const bodyParser = require("body-parser");
const argon = require("argon2");
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

app.post("/submit", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        console.log("Username or password not provided");
        return res.status(400).send("Username and password are required");
    }

    try {
        // Query to find the user by username
        const query = "SELECT password_hash FROM encodedPass WHERE username = ?";
        db.query(query, [username], async (error, results) => {
            if (error) {
                console.error("Database query error: ", error);
                return res.status(500).send("Internal server error");
            }

            if (results.length === 0) {
                // If no user is found with the provided username
                return res.status(404).send("User not found");
            }

            // Retrieve the stored password hash
            const storedHash = results[0].password_hash;

            // Verify the provided password against the stored hash
            const isPasswordValid = await argon.verify(storedHash, password);

            if (isPasswordValid) {
                // Password is valid, render the login page
                return res.render("loginPage.ejs", { sampData: username });
            } else {
                // Password is invalid
                return res.status(401).send("Login failed: invalid username or password");
            }
        });
    } catch (err) {
        // Catch any unexpected errors
        console.error("Unexpected error: ", err);
        return res.status(500).send("Internal server error");
    }
});


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