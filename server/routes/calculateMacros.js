/**
 * Created by munveergill on 11/03/2017.
 */
var express = require('express');
var router = express.Router();
var meals = require('../lib/meals');


router.get('/calculate-macros/:user', function(req, res) {

    var passedIn = req.params.user;



    //console.log(passedIn);
    meals.find(
        {username: passedIn},
        function(err, object) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
                return res.status(500).send();
            }else {
                //console.log(object);
                if(object.length > 0){
                    var numDaysBetween = function (d1, d2) {
                        var diff = Math.abs(d1.getTime() - d2.getTime());
                        return Math.round(diff / (1000 * 60 * 60 * 24));
                    };
                    var breakfast = [];
                    var dinner = [];
                    var lunch = [];
                    for (var i = 0; i < object.length; i++) {
                        var d1 = new Date();
                        var d2 = object[i].startDay;
                        //console.log(numDaysBetween(d1,d2));
                        var day = numDaysBetween(d2, d1);

                            if (typeof object[i].breakfast[day] == 'undefined' || typeof object[i].lunch[day] == 'undefined' || typeof object[i].dinner[day] == 'undefined') {
                                breakfast.push(0);
                                dinner.push(0);
                                lunch.push(0);
                            }
                            else {
                                breakfast.push(object[i].breakfast[day].nutrition);
                                dinner.push(object[i].dinner[day].nutrition);
                                lunch.push(object[i].lunch[day].nutrition);
                            }
                    }

                    var json = {
                        calories: "",
                        protein: "",
                        fat: "",
                        carbohydrates: ""

                    };
                    //console.log(breakfast);
                    //console.log(dinner);
                    //console.log(lunch);
                    json.calories = parseInt(breakfast[0].calories) + parseInt(lunch[0].calories) + parseInt(dinner[0].calories);
                    json.fat = parseInt(breakfast[0].totalFat) + parseInt(lunch[0].totalFat) + parseInt(dinner[0].totalFat);
                    json.protein = parseInt(breakfast[0].protein) + parseInt(lunch[0].protein) + parseInt(dinner[0].protein);
                    json.carbohydrates = parseInt(breakfast[0].carbohydrates) + parseInt(lunch[0].carbohydrates) + parseInt(dinner[0].carbohydrates);
                    res.json(json);
                }
                }
        });


});

module.exports = router;