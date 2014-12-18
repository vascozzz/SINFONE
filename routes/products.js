var express = require('express');
var router = express.Router();
var request = require('request');
var utils = require('../handlers/utils.js');


// GET search
router.get("/search", function(req, res) 
{    
    request({
        url: utils.globals.api + "artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {       
        var products = [];
          
        var q = req.query.q;
        var fam = req.query.fam;
        var sub = req.query.sub;
        var brand = req.query.brand;
        var model = req.query.model;
        var min = req.query.min;
        var max = req.query.max;
        
        for (var i = 0; i < body.length; i++) {
        
            // for each filter, if it is set and does not match, product can't be added
            if (q && !utils.containsString(body[i].DescArtigo, q)) {
                continue;
            }
            
            if (fam && !utils.containsString(body[i].Familia, fam)) {
                continue;
            }
            
            if (sub && !utils.containsString(body[i].SubFamilia, sub)) {
                continue;
            }
                
            if (brand && !utils.containsString(body[i].Marca, brand)) {
                continue;
            }
            
            if (model && !utils.containsString(body[i].Modelo, model)) {
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
        var search = {
            "q": q, 
            "min": min, 
            "max": max, 
            "fam": fam, 
            "sub": sub, 
            "brand": brand, 
            "model": model
        };
        
        res.render("search", {
            utils: utils.globals, 
            session: req.session, 
            alert: utils.handleAlerts(req),
            search: search, 
            products: products
        });
    });  
});


// POST add to cart
router.post("/add_to_cart", function(req, res)
{     
    var session = req.session;
    var product_id = req.body.product_id;
    var product_quantity = req.body.product_quantity;

    request({
        url: utils.globals.api + "artigos/" + product_id,
        method: "GET",
        json: true
    },
    function(error, response, body) {  
        if (!body) {
            return;
        }
        
        var product = {};
        
        product["CodArtigo"] = body.CodArtigo;
        product["DescArtigo"] = body.DescArtigo;
        product["pvp1"] = body.pvp1;
        product["quantity"] = product_quantity;
        
        if (typeof session.cart === "undefined") {
            session.cart = [];
        }
        
        session.cart.push(product);
       
        res.contentType("json");
        res.send(JSON.stringify(["OK"]));
    });
});


// POST clear cart
router.post("/clear_cart", function(req, res)
{     
    var session = req.session;
    
    // clear cart
    session.cart = null;
    
    res.redirect("/cart");
});


// GET product detail
router.get("/:id", function(req, res) 
{ 
    request({
        url: utils.globals.api + "artigos/" + req.params.id,
        method: "GET",
        json: true
    },
    function(error, response, body) {
        if (response.statusCode != 200) {
            res.status(404);
            res.render("error", {
                utils: utils.globals, 
                session: req.session,
                alert: utils.handleAlerts(req),
                message: "Product not found!", 
                error: {}
            });
        }
        else {
            res.render("product-detail", {
                utils: utils.globals, 
                session: req.session, 
                product: body
            });
        }       
    }); 
});


// GET products
router.get("/", function(req, res)
{
    request({
        url: utils.globals.api + "artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {        
        res.render("products", {
            utils: utils.globals, 
            session: req.session, 
            alert: utils.handleAlerts(req),
            products: body
        });
        
    });  
});

module.exports = router;