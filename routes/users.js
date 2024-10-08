require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const app = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); //Middleware for posting
app.use(express.urlencoded({ extended: true }));

const db = require("../models/database")

app.get("/", jwtAlrLoggedNoAgain, (req, res) => { //Upon loading the login page
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
                const user = {"username": username};

                const auth = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //Generates the token
                res.cookie('authToken', auth, { httpOnly: true, secure: true, sameSite: 'strict' });

                req.session.results = [username];
                return res.redirect("/homepage");
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

app.get("/logout", (req, res) => {
    res.clearCookie("authToken", {httpOnly: true, secure: true});

    res.redirect("/")
})


//Middleware for JWT to authenticate the user when they make requests
function jwtMiddleWare(req, res, next){ //Access middleware
    const token = req.cookies.authToken;
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    })
}   

function jwtMiddleWareHome(req, res, next){ //Access middleware
    const token = req.cookies.authToken;
    if (token === undefined) {
        req.isLogged = false;
        return res.render("mainPage.ejs");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            req.isLogged = false;
            return res.render("mainPage.ejs");
        }
        req.isLogged = true;
        req.user = user;
        next();
    })
}   

function jwtAlrLoggedNoAgain(req, res, next){ //Can't access login or sign up page if you already are logged in
    const token = req.cookies.authToken;
    if (token === undefined) {
        req.isLogged = false;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            req.isLogged = false;
            return next();
        }
        req.isLogged = true;
        req.user = user;
        return res.redirect("/homepage");
    })
}   

module.exports = {app, jwtMiddleWare, jwtMiddleWareHome, jwtAlrLoggedNoAgain};