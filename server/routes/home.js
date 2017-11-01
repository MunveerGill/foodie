/**
 * Created by munveergill on 24/01/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.get('/home', function(req, res) {

    if(!req.session.user){
        console.log("Not logged in");
        return res.status(401).send();
    }
    else{
        console.log("Welcome to super secret API");
        return res.status(200).send("Welcome!");
    }

});

module.exports = router;
