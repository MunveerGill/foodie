/**
 * Created by munveergill on 02/02/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.post('/macros', function(req, res) {

    //if(!req.session.user){
    //    console.log("Not logged in");
    //    return res.status(401).send();
    //}
    //else{

        var username = req.body.username;
        var height = req.body.height;
        var weight = req.body.currentWeight;
        var goalWeight = req.body.goalWeight;
        var activity = req.body.activity;
        var goal = req.body.goal;
        var gender = req.body.gender;
        var age = req.body.age;
        var BMR = 0;


        if(gender == 'M'){
             BMR += (10*weight) + (6.25*height) - (5*age) + 5;
        }
        else{
             BMR += (10*weight) + (6.25*height) - (5*age) - 161;
        }

        var TDEE = BMR*activity;
        // goal to lose weight
        if(goal == -1){
            TDEE = TDEE -(TDEE*0.2);
        }
        // goal to gain weight
        else if(goal == 1){
            TDEE = TDEE + (TDEE*0.2);
        }


        //1g Protein = 4 Calories
        //1g Carbohydrate = 4 Calories
        //1g Fat = 9 Calories

        var protein = (weight*2.2)*0.825;
        var fat = (TDEE*0.25)/9;
        var carbs = (TDEE - (protein*4 + fat*9))/4;


        user.findOneAndUpdate(
            {username: username}, // query
            {$set: {height: height, currentWeight: weight, goalweight: goalWeight, exerciseLevel: activity, goal: goal, bmr: BMR, tdee: TDEE, protein: protein, fat:fat, carbohydrates:carbs, gender: gender, age:age, goalWeight:goalWeight}}, // replacement, replaces only the field "hi"
            function(err, object) {
                if (err){
                    console.warn(err.message);  // returns error if no matching object found
                }else{
                    console.log("SENT TO MONGO");
                }
            });
    }
//}
);

module.exports = router;