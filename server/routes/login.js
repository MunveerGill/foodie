/**
 * Created by munveergill on 24/01/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/login', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    user.findOne({username: username}, function(err, user){
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        else if(!user){
            console.log("user not found");
            return res.status(404).send();
        }
        else {

            user.comparePassword(password, function(err, matched){
                if(matched && matched == true){
                    req.session.user = user;
                    console.log("logged in");
                    return res.status(200).send();
                }
                else{
                    return res.status(401).send();
                }
            });

        }
    })


});

module.exports = router;
