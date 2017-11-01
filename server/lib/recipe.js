/**
 * Created by munveergill on 06/01/2017.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RecipeSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);