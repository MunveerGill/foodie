/**
 * Created by munveergill on 11/01/2017.
 */

var Client = require('node-rest-client').Client;
var client = new Client();
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


router.get('/recipes/:ingredients', function(req, res){

    var passedIn = req.params.ingredients;
    console.log(passedIn);
    search(passedIn, function(data){
        res.json(data);

    });

});

function search(input, cb){

    MongoClient.connect('mongodb://localhost:27017/foodie', function(err, db) {
        if (err) return;

        var recipesCollection = db.collection('recipes');

        //{ $and:[ {ingredients: /lamb/}, {ingredients: /chicken/} ] }
        var query = {};
        var ingredients = "";
        var arr = [];

        if(input.includes('+')){
            console.log("yes +");
            var arrStr = input.split(/[+]/);
            //for (var i=0; i<arrStr.length; i++){
                ingredients += " " + arrStr;
                console.log("inside for " + ingredients);

            //}


            recipesCollection.find({$text: {$search: ingredients} }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).toArray(function (err, clientsColl) {
                cb(clientsColl);
                db.close();
            });
        }
       else{
            recipesCollection.find({ingredients: new RegExp(input, 'i')}).toArray(function(err, clientsColl) {
                cb(clientsColl);
                db.close();
            });
        }

    });
}

module.exports = router;
