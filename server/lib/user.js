/**
 * Created by munveergill on 24/01/2017.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;


var userSchema   = new Schema({
    username: {type: String, unique: true},
    password: {type: String},
    firstname: String,
    lastname: String,
    age: Number,
    gender: String,
    currentWeight: Number,
    height: Number,
    exerciseLevel: Number,
    bmr: Number,
    goal: Number,
    tdee: Number,
    protein: Number,
    fat: Number,
    carbohydrates: Number,
    likes: [],
    points: Number,
    allergies: [],
    caloriesGoal: Number,
    goalWeight: Number
});

userSchema.pre('save', function (next) {
    var user = this;

    if(!user.isModified('password')) return next();

       bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
           if (err) return next(err);
           bcrypt.hash(user.password, salt, function(err, hash){
               if(err) return next(err);
               //hash the text password
               user.password = hash;
               next();
           })
       })
});

userSchema.methods.comparePassword = function (userPassword, callback){

    bcrypt.compare(userPassword, this.password, function(err, matched){
        if(err) return callback(err);
        callback(undefined, matched);
    })

};

module.exports = mongoose.model('users', userSchema);