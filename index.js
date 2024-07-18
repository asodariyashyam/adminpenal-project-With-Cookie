const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser')
const port = 8008;
const app = express();
const db=require('./config/mongoose')

app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,'assets')))

app.use(express.urlencoded());

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/',require("./routes"))


app.listen(port, (error) => console.log("server running on port : " + port));