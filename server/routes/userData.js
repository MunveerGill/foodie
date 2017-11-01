/**
 * Created by munveergill on 10/02/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/set-user-data', function(req, res) {

    var username = req.body.username;
    //var likes = req.body.likes;
    var allergies = req.body.allergies;

    //console.log(likes);
    console.log("username"+username);

    user.findOneAndUpdate(
        {username: username}, // query
        {$set: {allergies:allergies}}, // replacement, replaces only the field "hi"
        function(err, object) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
                return res.status(500).send();
            }else{
                console.log("SENT TO MONGO");
                return res.status(200).send();
            }
        });


});

module.exports = router;