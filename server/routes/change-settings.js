/**
 * Created by munveergill on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/update-settings', function(req, res) {

    var username = req.body.oldusername;
    var newUsername = req.body.username;
    var firstname = req.body.firstname;
    var allergies = req.body.allergies;

    console.log(username);
    console.log(firstname);
    console.log(allergies);
    user.findOneAndUpdate(
        {username: username},
        {$set: {firstname: firstname,allergies:allergies, username: newUsername}},
        function(err, object) {
            if (err){
                console.warn(err.message);
                return res.status(500).send();
            }else{
                console.log("Change-settings");
                return res.status(200).send();
            }
        });


});

module.exports = router;