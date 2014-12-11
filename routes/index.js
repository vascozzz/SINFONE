var express = require('express');
var router = express.Router();
var request = require('request');

var utils = {"root":"http://localhost:3000/"}


// get GET params: req.query
// get POST params: req.body
// get url params: req.params


// TODO all these methods should be in their appropriate files
// TODO for now, util methods will be going here as well

function containsString(original, search)
{
    return original.toLowerCase().indexOf(search.toLowerCase()) > -1;
}


// GET homepage
router.get("/", function(req, res) 
{    
    session = req.session;
    
    request({
        url: "http://localhost:49822/api/artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {
        res.render("index", {utils: utils, session: session, products: body});
    });  
});


// GET search
router.get("/search", function(req, res) 
{    
    session = req.session;
    
    request({
        url: "http://localhost:49822/api/artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {       
        var products = [];
          
        var q = req.query.q;
        var min = req.query.min;
        var max = req.query.max;
        
        for (var i = 0; i < body.length; i++) {
        
            // for each filter, if it set and does not match, product can't be added
            if (q && !containsString(body[i].DescArtigo, q)) {
                continue;
            }
                
            if (min && body[i].pvp1 < min) {
                continue;
            }   
        
            if (max && body[i].pvp1 > max) {
                continue;
            }  
            
            // if we get here, there were no filters against it and product can now be added
            products.push(body[i]);   
        }
            
        // group all filters into a single variable so it can be passed onto the view
        var search = {"q": q, "min": min, "max": max};
        console.log(search);
        
        res.render("search", {utils: utils, session: session, search: search, products: products});
    });  
});


// GET product detail
router.get("/product/:id", function(req, res) 
{
    session = req.session;
    
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
            res.render("product-detail", {utils: utils, session: session, product: body});
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
        res.redirect("/");
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


module.exports = router;