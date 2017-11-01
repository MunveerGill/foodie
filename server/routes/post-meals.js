/**
 * Created by munveergill on 10/03/2017.
 */
var express = require('express');
var router = express.Router();
var meals = require('../lib/meals');

router.post('/post-meal', function(req, res) {

    var username = req.body.username;
    var breakfast = req.body.breakfast;
    var dinner = req.body.dinner;
    var duration = req.body.duration;
    var lunch = req.body.lunch;
    var startDay = req.body.startDay;


        var newMeal = new meals();
        newMeal.username = username;
        newMeal.breakfast = breakfast;
        newMeal.dinner = dinner;
        newMeal.duration = duration;
        newMeal.lunch = lunch;
        newMeal.startDay = startDay;
        newMeal.save(function(err){
            if(err){
                console.log(err);
                return res.status(500).send();
            }
            else{
                console.log("Logged meal");
                return res.status(200).send();
            }
        })


});


module.exports = router;