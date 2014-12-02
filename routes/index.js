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
        
        res.render("product-detail", {utils: utils, product: body});
    }); 
});     


module.exports = router;