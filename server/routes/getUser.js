/**
 * Created by munveergill on 10/02/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.get('/get-user/:username', function(req, res) {

    var passedIn = req.params.username;

    //console.log(username);
    user.find(
        {username: passedIn},
        {password: 0},
        function(err, object) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
                return res.status(500).send();
            }else{
                //console.log("Got user");
                //console.log(object);
                res.json(object);
                //return res.status(200).send();
            }
        });


});

module.exports = router;