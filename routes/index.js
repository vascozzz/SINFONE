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
    console.log(req.session.cookie);
    
    request({
        url: utils.globals.api + "artigos",
        method: "GET",
        json: true
    },
    function(error, response, body) {
        res.render("index", {
            utils: utils.globals, 
            session: req.session, 
            alert: utils.handleAlerts(req),
            products: body
        });
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
    else if (username === undefined || password === undefined) {
        session.alert = "Please complete all fields!";
        res.redirect("/");
    }
    else if (username === password) {
        session.alert = "Login successful!";
        session.username = username;
        res.redirect("/");
    }
    else {
        session.alert = "Wrong username or password!";
        res.redirect("/login");
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