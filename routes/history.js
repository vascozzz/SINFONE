var express = require('express');
var router = express.Router();
var request = require('request');
var utils = require('../handlers/utils.js');


// GET history list
router.get("/", function(req, res) 
{ 
    request({
        url: utils.globals.api + "docvenda",
        method: "GET",
        json: true
    },
    function(error, response, body) {
        if (response.statusCode != 200) {
            req.session.alert = "You have no history at this time!";
            res.redirect("/login");
        }
        else {
            session = req.session;
            var history = [];
            
            console.log(session.cod);
            
            for (var i = 0; i < body.length; i++) {      
                if (body[i].Entidade === session.cod) {
                    body[i].id = body[i].id.substring(1,body[i].id.length-1);
                    body[i].Data = body[i].Data.substring(0,10);
                    history.push(body[i]);
                }
            }
            
            res.render("history", {
                utils: utils.globals, 
                session: req.session, 
                alert: utils.handleAlerts(req),
                history: history
            });
        }       
    }); 
});


// GET history detail
router.get("/:id", function(req, res) 
{ 
    request({
        url: utils.globals.api + "docvenda/" + req.params.id,
        method: "GET",
        json: true
    },
    function(error, response, body) {
        if (response.statusCode != 200) {
            req.session.alert = "Not found!";
            res.redirect("/");
        }
        else {
            if (body.Entidade !== req.session.cod) {
                req.session.alert = "You do not have permission to view that page!";
                res.redirect("/");
            }
            else {
                body.id = body.id.substring(1,body.id.length-1);
                body.Data = body.Data.substring(0,10);
                
                res.render("history-detail", {
                    utils: utils.globals, 
                    session: req.session, 
                    alert: utils.handleAlerts(req),
                    history: body
                });
            }
        }       
    }); 
});


module.exports = router;