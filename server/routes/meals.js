/**
 * Created by munveergill on 01/02/2017.
 */
'use strict';

var express = require('express');
var router = express.Router();
var user = require('../lib/user');
var recipes = require('../lib/recipe');
let ug = require('ug');
let graph = new ug.Graph();
var request = require('request');


router.get('/meals/:username', function(req, res) {

    var passedIn = req.params.username;
    var userArray = [];
    var recipeArray = [];

    getUsers(userArray, function(data){
        getRecipes(recipeArray, function(data){

            for(var i=0; i<userArray.length; i++){
                let userNode = graph.createNode('user', {name: userArray[i].username});
                for(var j=0; j< userArray[i].likes.length; j++){
                    // if the recipe is in the nodes then just make it equal the one there
                    let recipeNode = graph.nodes('recipe').query().filter({name:userArray[i].likes[j]});
                    if(recipeNode._units.length > 0){
                        graph.createEdge('likes').link(
                            userNode,
                            recipeNode._units[0]
                        ).setDistance(2);
                    }
                    else{
                        graph.createEdge('likes').link(
                            userNode,
                            graph.createNode('recipe', {name: userArray[i].likes[j]})
                        ).setDistance(2);
                    }
                    // else create the node that it needs
                }
            }

            graph.save('uggraph.gz', function() {

            });

            graph.load('/path_to_saved_graph.ugd', function() {
                let userN = graph.nodes('user').query().filter({name:passedIn});
                let results = graph.closest(userN._units[0], {
                    compare: function(node) { return node.entity === 'recipe'; },
                    //minDepth: 3,
                    count: 100
                });

                let resultNodes = results.map(function(path) {
                    return path.end();
                });

                if(resultNodes.length == 0){

                    noSimilarUsers(passedIn, function(data){
                        console.log("no similar users");
                        res.json(data);

                    });
                }else{
                    var arrayOfRecipeNames = [];
                    for(var d =0; d<resultNodes.length; d++){
                        arrayOfRecipeNames.push(resultNodes[d].properties.name);
                    }
                    user.find({username: passedIn}, function(err, object){

                        var JSONstring = JSON.stringify(object);
                        var jsonObj = JSON.parse(JSONstring);

                        var likes =  jsonObj[0].likes;
                        var allergies = jsonObj[0].allergies[0];
                        var allergyArray = [];
                        var foodToAvoid = [];

                        if(allergies.vegan == true) {allergyArray.push("Vegan")}
                        if(allergies.vegetarian == true){ allergyArray.push("Vegetarian")}
                        if(allergies.nutAllergy == true) {allergyArray.push("Nut Free")}
                        if(allergies.dairyFree == true) {allergyArray.push("Dairy Free")}

                        if(allergies.other.length > 0){
                            for(var g =0; g < allergies.other.length; g++){
                                foodToAvoid.push(allergies.other[g]);
                            }
                        }
                        foodToAvoid = regexArray(foodToAvoid);
                        if(allergies.vegan == false && allergies.vegetarian == false && allergies.nutAllergy == false && allergies.dairyFree == false){
                            recipes.find({$and: [{name: {$in:arrayOfRecipeNames}},
                                {ingredients: {$nin: foodToAvoid}} ]}, function(err, object){
                                var JSONstring = JSON.stringify(object);
                                var jsonObj = JSON.parse(JSONstring);
                                checkTagsAndPutInGroup(jsonObj, function(data){
                                    //macroSplitMeals(data, passedIn, function(yea){
                                        res.json(data);
                                        //res.json(yea);
                                    //});
                                });
                            });
                        }
                        else{
                            recipes.find({$and: [{name: {$in:arrayOfRecipeNames}},{tags: {$in: allergyArray}},
                                {ingredients: {$nin: foodToAvoid}} ]}, function(err, object){
                                var JSONstring = JSON.stringify(object);
                                var jsonObj = JSON.parse(JSONstring);
                                checkTagsAndPutInGroup(jsonObj, function(data){
                                    //macroSplitMeals(data, passedIn, function(yea){
                                        res.json(data);
                                        //res.json(yea);
                                    //});
                                });
                            });
                        }

                    });
                }
        });
        })
    });
});

function getUsers(array, cb){
    user.find(function(err, object) {
        if (err) {
            console.warn(err.message);  // returns error if no matching object found
            return err;
        } else {
            for(var i =0; i< object.length; i++){
                array.push(object[i]);
            }
        }
        cb(array);
    });
}

function getRecipes(array, cb){
    recipes.find(function(err, object) {
        if (err) {
            console.warn(err.message);  // returns error if no matching object found
            return err;
        } else {
            for(var i =0; i< object.length; i++){
                array.push(object[i].name);
            }
        }
        cb(array);
    });
}

function noSimilarUsers(username, callback){


  user.find({username: username}, function(err, object){
      var JSONstring = JSON.stringify(object);
      var jsonObj = JSON.parse(JSONstring);

      var likes =  jsonObj[0].likes;
      var allergies = jsonObj[0].allergies[0];
      var allergyArray = [];
      var foodToAvoid = [];

      if(allergies.vegan == true) {allergyArray.push("Vegan")}
      if(allergies.vegetarian == true){ allergyArray.push("Vegetarian")}
      if(allergies.nutAllergy == true) {allergyArray.push("Nut Free")}
      if(allergies.dairyFree == true) {allergyArray.push("Dairy Free")}

      if(allergies.other.length > 0){
          for(var g =0; g < allergies.other.length; g++){
              foodToAvoid.push(allergies.other[g]);
          }
      }
      foodToAvoid = regexArray(foodToAvoid);
      recipes.find({name: {$in: likes}}, function(err, object){
          var str = JSON.stringify(object);
          var obj = JSON.parse(str);


          var tags = [];
          for(var f = 0; f<object.length; f++){
              //console.log(obj[f].tags);
              for(var q =0; q< obj[f].tags.length; q++){
                  tags.push(obj[f].tags[q]);
              }
          }

          recipes.find({$and: [
              {tags: {$in: tags}},
              {tags: {$in: allergyArray}},
              {ingredients: {$nin: foodToAvoid}}
          ]}).limit(50)
          .execFind(function(err, object){
              callback(object);
          })

      })

  })


}

function checkTagsAndPutInGroup(jsonData, callback){
    var formatedJSON = {

        breakfast : [],
        lunch: [],
        dinner: []

    };

    for(var r = 0; r<jsonData.length; r++){
        //console.log(jsonData[r].tags);
        if(jsonData[r].tags.indexOf('Breakfast') > -1 || jsonData[r].tags.indexOf('Morning') > -1  || jsonData[r].tags.indexOf('morning') > -1 || jsonData[r].tags.indexOf('Healthy breakfast') > -1 || jsonData[r].tags.indexOf('Breakfast & Brunch') > -1 || jsonData[r].tags.indexOf('Brunch') > -1 || jsonData[r].tags.indexOf('Breakfast recipes') > -1){
            formatedJSON.breakfast.push(jsonData[r]);
            //console.log("hello");
        }
        if(jsonData[r].tags.indexOf('Brunch recipes') > -1 || jsonData[r].tags.indexOf('Packed lunch') > -1 || jsonData[r].tags.indexOf('Lunch') > -1 || jsonData[r].tags.indexOf('Light lunch') > -1 || jsonData[r].tags.indexOf('Picnic') > -1 || jsonData[r].tags.indexOf('Sunday lunch') > -1 || jsonData[r].tags.indexOf('Midweek meal recipes') > -1 || jsonData[r].tags.indexOf('Midweek meals') > -1 || jsonData[r].tags.indexOf('Lunchbox') > -1 || jsonData[r].tags.indexOf('Light') > -1 || jsonData[r].tags.indexOf('Main meal salad') > -1|| jsonData[r].tags.indexOf('Soup') > -1){
            formatedJSON.lunch.push(jsonData[r])
        }
        if(jsonData[r].tags.indexOf('Dinner') > -1 || jsonData[r].tags.indexOf('Supper') > -1 || jsonData[r].tags.indexOf('Main Dishes') > -1 || jsonData[r].tags.indexOf('Dinner party') > -1 || jsonData[r].tags.indexOf('Family supper') > -1 || jsonData[r].tags.indexOf('Family favourite') > -1 || jsonData[r].tags.indexOf('Curry') > -1 || jsonData[r].tags.indexOf('Dinner party recipes') > -1 || jsonData[r].tags.indexOf('Dinner party recipe') > -1 || jsonData[r].tags.indexOf('Family meal') > -1 || jsonData[r].tags.indexOf('Family dinner') > -1|| jsonData[r].tags.indexOf('Family') > -1 || jsonData[r].tags.indexOf('Christmas dinner') > -1 ){
            formatedJSON.dinner.push(jsonData[r])
        }
    }
    callback(formatedJSON);

}

function regexArray(data){

    for(var i =0; i< data.length; i++){

        data[i] = new RegExp(data.join("|"), 'gi');

    }
    return data;

}

function macroSplitMeals(data,username, callback){
    var breakfast = data.breakfast;
    var lunch = data.lunch;
    var dinner = data.dinner;

    //console.log(breakfast);
    var newBreakfast = [];
    var newLunch = [];
    var newDinner = [];
    // macro split should be 40:40:20
    user.find({username: username}, function(err, object){
       console.log(object[0].bmr);
        if(object[0].bmr != undefined){
            console.log("has BRMR");

            console.log("carbs: " +object[0].carbohydrates);
            for(var i=0; i< breakfast.length; i++){
                //console.log(breakfast[i].nutrition.carbohydrates);
                if(stringToInt(breakfast[i].nutrition.carbohydrates) >= (object[0].carbohydrates*0.25) || stringToInt(breakfast[i].nutrition.totalFat) <= (object[0].fat*0.25)|| stringToInt(breakfast[i].nutrition.protein) >= (object[0].protein*0.25)){
                    newBreakfast.push(breakfast[i]);
                }
            }
            for(var j=0; j< lunch.length; j++){
                console.log(lunch[j].nutrition.carbohydrates);

                if(stringToInt(lunch[i].nutrition.carbohydrates) >= (object[0].carbohydrates*0.25) || stringToInt(lunch[i].nutrition.totalFat) <=(object[0].fat*0.25)|| stringToInt(lunch[i].nutrition.protein) >= (object[0].protein*0.25)){
                    newLunch.push(lunch[i]);
                }
            }
            for(var k=0; k< dinner.length; k++){

                if(stringToInt(dinner[k].nutrition.carbohydrates) >= (object[0].carbohydrates*0.25) || stringToInt(dinner[k].nutrition.totalFat) <= (object[0].fat*0.25)|| stringToInt(dinner[k].nutrition.protein) >= (object[0].protein*0.25)){
                    newDinner.push(dinner[k]);
                }
            }
            console.log(newDinner);
            var macroMeals ={
                breakfast: newBreakfast,
                lunch: newLunch,
                dinner: newDinner
            };

            callback(macroMeals);
        }
        else{
            console.log("has no BRMR");
            callback(data);
        }
    });
}

function stringToInt(string){
    string.replace(/g/i, "");

    return parseInt(string);
}
module.exports = router;