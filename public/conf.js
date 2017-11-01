/**
 * Created by munveergill on 19/03/2017.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./test/todo-spec.js', './test/recipe-details.js', './test/goal.js']
};