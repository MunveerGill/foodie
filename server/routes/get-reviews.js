/**
 * Created by munveergill on 08/03/2017.
 */
var express = require('express');
var router = express.Router();
var reviews = require('../lib/reviews');

router.get('/get-reviews/:recipe', function(req, res) {

    var passedIn = req.params.recipe;

    //console.log(username);
    reviews.find(
        {recipeName: passedIn},
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