/**
 * Created by munveergill on 08/03/2017.
 */
var express = require('express');
var router = express.Router();
var reviews = require('../lib/reviews');
var user = require('../lib/user');

router.post('/post-review', function(req, res) {

    var username = req.body.username;
    var like = req.body.liked;
    var desc = req.body.description;
    var recipeName = req.body.recipeName;

    getName(username, function(data){
        var firstname = data[0].firstname;
        var newReview = new reviews();
        newReview.username = username;
        newReview.firstname = firstname;
        newReview.liked = like;
        newReview.description = desc;
        newReview.recipeName = recipeName;
        newReview.save(function(err, savedUser){
            if(err){
                console.log(err);
                return res.status(500).send();
            }
            else{
                console.log("Logged review");
                return res.status(200).send();
            }
        })

    });

});

function getName(username, callback){
    user.find({username: username}, function(err, object){
        if(err) return;
        callback(object);
    });
}

module.exports = router;