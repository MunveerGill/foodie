/**
 * Created by munveergill on 24/01/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/register', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var newUser = new user();
    newUser.username = username;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.save(function(err, savedUser){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        else{
            console.log("Registered");
            return res.status(200).send();
        }
    })


});

module.exports = router;
