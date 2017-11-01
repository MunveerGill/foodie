/**
 * Created by munveergill on 13/01/2017.
 */

var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;


router.get('/getrecipe/:id', function(req, res) {
    var passedIn = req.params.id;
    var objID = new ObjectId(passedIn);
    //res.json({ message: 'This is get recipe', id: passedIn });
    //console.log("hello recipe")

    getRecipe(objID, function(data){
        //console.log(data);
        res.json(data);

    });
});

function getRecipe(recipeID, cb){


        MongoClient.connect('mongodb://localhost:27017/foodie', function(err, db) {
            if (err) return;

            var recipesCollection = db.collection('recipes');

            recipesCollection.find({_id: recipeID}).toArray(function(err, clientsColl) {
                cb(clientsColl);
                db.close();
            });
        });
}

//getRecipe("French-Onion-Soup-The-Pioneer-Woman-Cooks-_-Ree-Drummond-41364");


module.exports = router;
