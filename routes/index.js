const express=require('express');

const routes=express.Router();

routes.use('/',require("./admin"))


module.exports= routes