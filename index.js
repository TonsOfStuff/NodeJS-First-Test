const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');



const serverRouter = require('./routes/server'); //Telling our app that the router folder and routes folder exists
const userRouter = require('./routes/users').app;
const signupRouter = require('./routes/signup');

app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); //Server rending views
app.set('layout', 'layouts/layout') //Setting app so that header and footer don't have to be updated each time we make a change
app.use(expressLayouts);
app.use(express.static('public'));
app.use(cookieParser());

app.use("/", serverRouter);
app.use("/users", userRouter);
app.use("/signup", signupRouter);

app.listen(process.env.PORT || 3000);











