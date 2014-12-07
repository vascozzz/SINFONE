var express = require('express');
var router = express.Router();
var request = require('request');

var utils = {"root":"http://localhost:3000/"}


// GET homepage
router.get("/", function(req, res) 
{    
    request({
        url: "http://localhost:49822/api/artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {
        res.render("index", {utils: utils, products: body});
    });  
});


// GET product detail
router.get("/product/:id", function(req, res) 
{
    request({
        url: "http://localhost:49822/api/artigos/" + req.params.id,
        method: "GET",
        json: true
    },
    function(error, response, body) {        
        if (body === undefined) {
            res.status(500);
            res.render('error', {utils: utils, message: "Product not found!", error: {}});
        }
        else {
            res.render("product-detail", {utils: utils, product: body});
        }       
    }); 
});


// GET login
router.get("/login", function(req, res) 
{
    res.render("login", {utils: utils});        
});


// POST login
router.post("/login", function(req, res) 
{
    if (req.session.username) {
        res.send("Already logged in!");
    }
    else if (req.body.username === undefined) {
        res.send("Please stop messing around!");   
    }
    else {
        req.session.username = req.body.username;
        res.redirect("/expm");
    }
});


// GET logout
router.get("/logout", function(req, res) 
{
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        }
        res.redirect("/");
    });
});


// GET experiment
router.get("/expm", function(req, res) 
{
    session = req.session;
    
    if (!session.username) {
        res.send("not logged in");
    }
    else {
       res.send("hellooooo, " + session.username); 
    }
});


module.exports = router;