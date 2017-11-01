var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var index = require('./server/routes/index');
var recipe = require('./server/routes/recipe');
var recipeSearch = require('./server/routes/recipeSearch');
var getRecipe = require('./server/routes/getRecipe');
var register = require('./server/routes/register');
var login = require('./server/routes/login');
var home = require('./server/routes/home');
var logout = require('./server/routes/logout');
var meals = require('./server/routes/meals');
var macros = require('./server/routes/macros');
var userData = require('./server/routes/userData');
var getUser = require('./server/routes/getUser');
var likes = require('./server/routes/likes');
var reccommend = require('./server/routes/initialRecommendations');
var postReview = require('./server/routes/post-review');
var getReviews = require('./server/routes/get-reviews');
var getRecipeByName = require('./server/routes/get-recipe');
var postMeal = require('./server/routes/post-meals');
var getMeals = require('./server/routes/get-meals');
var macroCalc = require('./server/routes/calculateMacros');
var recipeDetailLike = require('./server/routes/like');
var changeDetails = require('./server/routes/change-settings');

var app = express();

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/foodie');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(session({secret:"34fwrff34ttrhyrthg54543ffsdkosfnjfvdf", resave: false, saveUninitialized: true}));

var port = 3000;

app.use('/', index);
app.use('/recipes', recipe);
app.get('/recipes/:ingredients', recipeSearch);
app.get('/getrecipe/:id', getRecipe);
//app.get('/getrecipe/:id', getRecipe);
app.get('/home', home);
app.get('/logout', logout);
app.get('/meals/:username', meals);
app.get('/get-user/:username', getUser);
app.get('/initial-rec/:username', reccommend);
app.get('/get-reviews/:recipe', getReviews);
app.get('/get-recipe/:recipe', getRecipeByName);
app.get('/get-meals/:user', getMeals);
app.get('/calculate-macros/:user',macroCalc);

app.post('/register', register);
app.post('/login', login);
app.post('/macros', macros);
app.post('/set-user-data', userData);
app.post('/likes', likes);
app.post('/post-review', postReview);
app.post('/post-meal', postMeal);
app.post('/like', recipeDetailLike);
app.post('/update-settings', changeDetails);

app.listen(port);
console.log('Magic happens on port ' + port);
