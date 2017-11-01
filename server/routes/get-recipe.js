/**
 * Created by munveergill on 10/03/2017.
 */
var express = require('express');
var router = express.Router();
var recipes = require('../lib/recipe');


router.get('/get-recipe/:recipe', function(req, res) {

    var passedIn = req.params.recipe;

    //console.log(username);
    recipes.find(
        {name: passedIn},
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