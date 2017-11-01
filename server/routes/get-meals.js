/**
 * Created by munveergill on 10/03/2017.
 */
var express = require('express');
var router = express.Router();
var meals = require('../lib/meals');


router.get('/get-meals/:user', function(req, res) {

    var passedIn = req.params.user;

    //console.log(username);
    meals.find(
        {username: passedIn},
        function(err, object) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
                return res.status(500).send();
            }else{
                res.json(object);
            }
        });


});

module.exports = router;