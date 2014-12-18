var express = require('express');
var router = express.Router();
var request = require('request');
var utils = require('../handlers/utils.js');


/* For reference and ease of use, gettings params from requests:
 * GET params: req.query
 * POST params: req.body
 * URL params: req.params
 */


// GET homepage
router.get("/", function(req, res) 
{    
    request({
        url: utils.globals.api + "artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {
        
        var news = [];
        var promotions = [];
        var featured = [];
        
        for (var i = 0; i < body.length; i++)
        {
            if(body[i].Novidade) {
                news.push(body[i]);
            }
            
            if(body[i].Promocao) {
                promotions.push(body[i]);
            }
            
            if(body[i].Feature) {
                featured.push(body[i]);
            }
        }
        
        res.render("index", {
            utils: utils.globals, 
            session: req.session, 
            alert: utils.handleAlerts(req),
            news: news,
            promotions: promotions,
            featured: featured
        });
    });  
});


// POST register
router.post("/register", function(req, res)
{
    if(req.body.password != req.body.confirm)
    {
        req.session.alert = "Password confirmation is incorrect!";
        res.redirect("/login");
    }
    
    var newCliente = {
        "CodCliente": "A000",
        "NomeCliente": req.body.name,
        "NumContribuinte": req.body.nif,
        "Moeda":"EUR",
        "Morada": req.body.address,
        "Localidade": req.body.city,
        "codPostal": req.body.postalcode,
        "codPostalLocalidade": req.body.citypostalcode,
        "telefone": req.body.phone,
        "username": req.body.username,
        "Password": req.body.password
    }

    request({
        headers: {'content-type' : 'application/json'},
        url: utils.globals.api + "clientes",
        method: "POST",
        json: true,
        body: JSON.stringify(newCliente)
    },
    function(error, response, body) {
        if(response.statusCode != 201)
        {
            req.session.alert = "An error ocurred whilst creating your account!";
            res.redirect("/login");
        }
        else
        {
            req.session.alert = "User registered successfully!";
            res.redirect("/");          
        }
    });  

});


// GET login
router.get("/login", function(req, res) 
{
    res.render("login", {
        utils: utils.globals,
        session: req.session,
        alert: utils.handleAlerts(req)
    });        
});


// POST login
router.post("/login", function(req, res) 
{
    var session = req.session;
    var username = req.body.username;
    var password = req.body.password;
    
    if (session.username) {
        session.alert = "Already logged in!";
        res.redirect("/login");
    }
    
    if (username === undefined || password === undefined) {
        session.alert = "Please complete all fields!";
        res.redirect("/");
    }
    
    request({
        url: utils.globals.api + "clientes/" + username,
        method: "GET",
        json: true
    },
    function(error, response, body) {        
        if (response.statusCode != 200) {
            session.alert = "Username not found!";
            res.redirect("/login");
        }
        else {
            if (password === body.Password) {
                session.alert = "Login successful!";
                session.username = username;
                session.cod = body.CodCliente;
                res.redirect("/");   
            }
            else {
                session.alert = "You've entered the wrong password!";
                res.redirect("/login");
            }
        }         
    }); 
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


// GET cart
router.get("/cart", function(req, res) 
{
    session = req.session;
    cart = session.cart;
    
    console.log(cart);
    
    if (cart) {
        for (var i = 0; i < cart.length; i++) {
            cart[i].total = cart[i].pvp1 * cart[i].quantity;
        }
    }
    
    res.render("cart", {
        utils: utils.globals,
        session: session,
        alert: utils.handleAlerts(req)
    });
});


// GET checkout (actually POST, later to be changed)
router.get("/checkout", function(req, res)
{
    var cart = req.session.cart;
    
    if(!cart)
    {
        req.session.alert = "Your shopping cart is empty!";
        res.redirect("/");
    }
    
    var products = [];
    
    for(var i=0; i<cart.length; i++)
    {
        var product = {
            "CodArtigo":cart[i].CodArtigo,
            "Quantidade":cart[i].quantity,
            "PrecoUnitario":cart[i].pvp1
        }
        
        products.push(product);
    }
    
        
    var invoice = {
        "Entidade":req.session.cod,
        "LinhasDoc":products
    }
    
    
    request({
        headers: {'content-type' : 'application/json'},
        url: utils.globals.api + "docvenda",
        method: "POST",
        json: true,
        body: JSON.stringify(invoice)
    },
    function(error, response, body) {
        if(response.statusCode != 201)
        {
            req.session.alert = "An error ocurred whilst creating your invoice!";
            res.redirect("/");
        }
        else
        {
            req.session.alert = "Your purchase has been successful!";
            res.session.cart = null;
            res.redirect("/history");          
        }
    });  
});


module.exports = router;