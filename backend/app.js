const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");


const sauceRoutes = require('./routes/sauce');
const userRoutes = require ('./routes/user');


const mangoConnect = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.bkqokuh.mongodb.net/?retryWrites=true&w=majority`

mongoose
.connect(mangoConnect)
.then (() => console.log("connection mango réussi"))
.catch ((err) => console.log("connection mango échoué"))

const app = express(); 
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(xss());
app.use(helmet())


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)




module.exports = app;
