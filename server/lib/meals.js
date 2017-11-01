/**
 * Created by munveergill on 10/03/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MealsSchema   = new Schema({
    username: String,
    breakfast: [],
    lunch: [],
    dinner: [],
    duration: String,
    startDay: Date
});

module.exports = mongoose.model('meals', MealsSchema);