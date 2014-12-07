var express = require('express');
var router = express.Router();


// GET logout
router.get("/", function(req, res) 
{
    res.send("users pages?");
});


module.exports = router;
