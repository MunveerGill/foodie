/**
 * Created by munveergill on 17/02/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/likes', function(req, res) {

    var username = req.body.username;
    var likes = req.body.likes;

    for (var i =0; i< likes.length; i++){
        user.findOneAndUpdate(
            {username: username}, // query
            {$addToSet: {likes:likes[i]}}, // replacement, replaces only the field "hi"
            function(err, object) {
                if (err){
                    console.warn(err.message);  // returns error if no matching object found
                    return res.status(500).send();
                }else{
                    console.log("SENT TO MONGO");
                    return res.status(200).send();
                }
            });
    }




});

module.exports = router;