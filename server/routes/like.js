/**
 * Created by munveergill on 13/03/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/like', function(req, res) {

    var username = req.body.username;
    var likes = req.body.likes;

        user.update(
            {username: username}, // query
            {$push: {likes:likes}}, // replacement, replaces only the field "hi"
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