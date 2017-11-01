/**
 * Created by munveergill on 15/02/2017.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
const util = require('util');


var app = express();

var _id = 1;

const urls =  [
    "http://www.bbcgoodfood.com/recipes/4414/warm-chorizo-sweet-potato-and-egg-salad",
    "http://www.bbcgoodfood.com/recipes/3445/welsh-goats-cheese-and-leek-tart",
    "http://www.bbcgoodfood.com/recipes/4945/caramelised-nuts",
    "http://www.bbcgoodfood.com/recipes/8003/chocolate-crunch-bars",
    "http://www.bbcgoodfood.com/recipes/4855/chocolate-fondue-and-toasted-marshmallow",
    "http://www.bbcgoodfood.com/recipes/1143/chunky-chocolate-nut-bars",
    "http://www.bbcgoodfood.com/recipes/6603/classic-sponge-sandwich",
    "http://www.bbcgoodfood.com/recipes/4988/double-chocolate-almond-biscotti",
    "http://www.bbcgoodfood.com/recipes/1417/forest-fruit-and-banana-smoothie",
    "http://www.bbcgoodfood.com/recipes/2919/homemade-marzipan-thins",
    "http://www.bbcgoodfood.com/recipes/3436/honey-nut-crunch-pears",
    "http://www.bbcgoodfood.com/recipes/1136/lemon-star-biscuits",
    "http://www.bbcgoodfood.com/recipes/4989/little-candy-canes",
    "http://www.bbcgoodfood.com/recipes/2562/little-frosty-christmas-cakes",
    "http://www.bbcgoodfood.com/recipes/4986/milk-chocolate-and-pistachio-truffles",
    "http://www.bbcgoodfood.com/recipes/4629/nocook-chocolate-tart-",
    "http://www.bbcgoodfood.com/recipes/1475/orange-pumpkin-face-cookies",
    "http://www.bbcgoodfood.com/recipes/4301/peppermint-lollipops",
    "http://www.bbcgoodfood.com/recipes/3257/rhubarb-and-strawberry-meringue-pots",
    "http://www.bbcgoodfood.com/recipes/4900/simple-gingerbread-house",
    "http://www.bbcgoodfood.com/recipes/4940/snowball-truffles",
    "http://www.bbcgoodfood.com/recipes/6918/aubergine-curry-with-fresh-tomato-and-coriander",
    "http://www.bbcgoodfood.com/recipes/7679/baked-apples-with-prunes-cinnamon-and-ginger",
    "http://www.bbcgoodfood.com/recipes/2047/basic-granary-bread-dough-for-rolls-or-a-large-loa",
    "http://www.bbcgoodfood.com/recipes/5521/biscuity-lime-pie",
    "http://www.bbcgoodfood.com/recipes/3105/blueberry-and-lime-cheesecake",
    "http://www.bbcgoodfood.com/recipes/3747/borough-market-brownies",
    "http://www.bbcgoodfood.com/recipes/4423/broad-bean-pecorino-and-lemon-risotto",
    "http://www.bbcgoodfood.com/recipes/4651/cheesy-onion-pizza",
    "http://www.bbcgoodfood.com/recipes/6523/cherry-swirl-cheesecake",
    "http://www.bbcgoodfood.com/recipes/1293/chilli-con-carne-soup",
    "http://www.bbcgoodfood.com/recipes/3696/chocolate-and-vanilla-melting-moments",
    "http://www.bbcgoodfood.com/recipes/3502/chocolate-biscuit-truffles",
    "http://www.bbcgoodfood.com/recipes/11587/chocolate-caramel-cake"

];

app.get('/scrape', function (req, res) {

    // Url to scrape -- chocolate chip biscotti from thefoodnetwork.ca
    // url = 'http://www.skinnytaste.com/chunky-beef-cabbage-and-tomato-soup-instant-pot/';

    //http://www.foodnetwork.ca/recipe/ham-and-barley-risotto/12813/

    function getRecipe (url, callback){
        request(url, function (error, response, html) {

            if (!error) {

                var $ = cheerio.load(html);

                var json = {
                    //id : _id++,
                    name: "",
                    ingredients: [],
                    instructions: [],
                    nutrition: {
                        calories: "",
                        totalFat: "",
                        saturatedFat: "",
                        cholesterol: "",
                        sodium: "",
                        carbohydrates: "",
                        fiber: "",
                        sugar: "",
                        protein: ""
                    },
                    totalServings: "",
                    cookTime: "",
                    image: {
                        largeImage: "",
                        smallImage: ""
                    },
                    tags: []
                };

                // Get unique class '.no top margin and get sibling element'
                var numberPattern = /\d+/g;



                $('li[class = "ingredients-list__item"]').each(function(i, el) {

                    var domElem = $("*[itemprop = 'ingredients']").get(i);
                    var content = $(domElem).find('a').html();
                    if(content){
                        var measurement = "";
                        if(el.children[0].data == undefined){
                            for(var i =0; i < el.children.length; i++){
                                if(el.children[i].data != undefined){
                                    measurement = el.children[i].data
                                }
                            }
                            json.ingredients.push(content+ measurement);
                        }
                        else{
                            json.ingredients.push(el.children[0].data + content);
                        }
                    }
                    else{
                        json.ingredients.push(el.children[0].data);
                    }

                });

                function findByItemProp(propItem){
                    var value = propItem;
                    var format = "*[itemprop = '" + value + "']";
                    var x = $(format).get(0);
                    var itemprop = $(x).text().trim();

                    return itemprop;
                }


                json.name = findByItemProp("name");

                var calories =  findByItemProp("calories");
                calories = calories.match( numberPattern );
                if(calories != null){
                    calories = calories.toString();
                }

                var ada = $("img[itemprop = 'image']").get(0);
                if(ada != undefined){
                    json.image.smallImage = ada.attribs.src;
                }

                var count = $('meta[itemprop="keywords"]').length;
                var tags = [];
                for(var i=0; i<count; i++){

                    tags.push($('meta[itemprop="keywords"]')[i].attribs.content);
                }

                json.tags = tags;


                json.nutrition.calories = calories;

                json.cookTime = findByItemProp("totalTime");

                json.totalServings = findByItemProp("recipeYield");

                json.nutrition.totalFat = findByItemProp("fatContent");

                json.nutrition.saturatedFat = findByItemProp("saturatedFatContent");

                $('.method__item').each(function(i, el) {
                    json.instructions.push($(this).text().trim());
                });
                //json.instructions = findByItemProp("recipeInstructions");

                json.nutrition.cholesterol = findByItemProp("cholesterolContent");

                json.nutrition.sodium = findByItemProp("sodiumContent");

                json.nutrition.carbohydrates = findByItemProp("carbohydrateContent");

                json.nutrition.fiber = findByItemProp("fiberContent");

                json.nutrition.sugar = findByItemProp("sugarContent");

                json.nutrition.protein = findByItemProp("proteinContent");
            }

            if(findByItemProp("calories") != null){
                fs.appendFile('bbc.json', ',' +JSON.stringify(json, null, 4), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File successfully written');
                    }
                });
            }

        });

    }

    async.map(urls, getRecipe, function(err, res){
        console.log(urls);
        if(err) return console.log(err);
        console.log(res);
        var coun = 1;
        console.log(coun++);

    })

});


app.listen(8080, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port on 8080");
    }
});

exports = module.exports = app;
