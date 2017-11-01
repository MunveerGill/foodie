/**
 * Created by munveergill on 21/02/2017.
 */
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/foodie');
var async = require('async');

var obj = require("./users.json");

var recipes = require('../lib/recipe');


function getLikes(json, cb){

    var listOfLikes = [];
    for(var i = 0; i < json.length; i++){
        for(var j =0; j < json[i].likes.length; j++){
            listOfLikes.push(json[i].likes[j]);
        }
    }

    return cb(listOfLikes);

}

function checkIfExists(array, cb){
    var output = [];
    //console.log(array);
    for(var i =0; i < array.length; i++){
        recipes.count({name: array[i]}, function(err, object, array) {
            console.log(object);
            if(object == 0){
                output.push(array[i]);

            }
        })
    }
    return cb(output);


}
// Reference https://blog.jcoglan.com/2010/08/30/the-potentially-asynchronous-loop/
Array.prototype.asyncEach = function(iterator) {
    var list    = this,
        n       = list.length,
        i       = -1,
        calls   = 0,
        looping = false;

    var iterate = function() {
        calls -= 1;
        i += 1;
        if (i === n) return;
        iterator(list[i], resume);
    };

    var loop = function() {
        if (looping) return;
        looping = true;
        while (calls > 0) iterate();
        looping = false;
    };

    var resume = function() {
        calls += 1;
        if (typeof setTimeout === 'undefined') loop();
        else setTimeout(iterate, 1);
    };
    resume();
};




getLikes(obj, function(data){

    data.asyncEach(function(item, resume) {
        var output = [];

            recipes.count({name: item}, function(err, object, array) {
                if(object == 0){
                    console.log(item.toLowerCase());
                }
            });
        resume();
    });

});



