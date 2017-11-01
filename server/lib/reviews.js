/**
 * Created by munveergill on 08/03/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RecipeSchema   = new Schema({
    username: String,
    recipeName: String,
    firstname: String,
    liked: Boolean,
    description: String
});

module.exports = mongoose.model('reviews', RecipeSchema);