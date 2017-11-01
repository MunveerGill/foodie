/**
 * Created by munveergill on 17/02/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');
var recipes = require('../lib/recipe');

router.get('/initial-rec/:username', function(req, res) {

    var passedIn = req.params.username;
    getDiet(passedIn, function(data){

        var tagArray = formatJSONtoArray(data);
        console.log(data);
        var otherArray = regexArray(data.other);
        getRecipes(tagArray, otherArray, function(data){
            //console.log(data);
            res.json(data);
        });
    });


});

function getDiet(username, cb){

    user.find(
        {username: username},
        function(err, object) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
                return err;
            }else{
                var all = (object[0].allergies);
                return cb(all[0]);
            }
        });

}

function formatJSONtoArray(allergies){

    var array = [];
    if(allergies.dairyFree == true) {
        array.push('Dairy Free');
        console.log('in dairy');
    }
    if(allergies.nutAllergy == true) {
        array.push('Nut Free');
        console.log('nut free');

    }
    if(allergies.vegan == true) {
        array.push('Vegan');
        console.log('vegan');

    }
    if(allergies.vegetarian == true) {
        array.push('Vegetarian');
        console.log('vegge');

    }

    return array;
}

function regexArray(data){

    for(var i =0; i< data.length; i++){

        data[i] = new RegExp(data.join("|"), 'gi');

    }
    return data;

}

function getRecipes(tags, other, cb){

    var random = Math.random()*1900;

    var query;
    console.log(tags);
    console.log(other);

    if(tags.length == 0 && other.length == 0){
        query = recipes.find({}).limit(30).skip(random);
        console.log("have no allergies");
        // show random selection of recipes
    }
    else if (tags.length > 0 && other.length == 0){
         query = recipes.find({tags: {$all:tags}}).limit(30);
        console.log("tags yes, other no");
    }
    else if (tags.length == 0 && other.length > 0){
         query = recipes.find({ingredients : {$nin: other}}).limit(30);
        console.log("tags no, other yes");
    }
    else{
         query = recipes.find(
             {$and: [{tags: {$all: tags}},
             {ingredients: {$nin: other}}]}
         ).limit(30);


    }
    query.execFind(function(err, object) {
        if (err) {
            console.warn(err.message);  // returns error if no matching object found
            return err;
        } else {
            return cb(object);
        }
    })

}

module.exports = router;