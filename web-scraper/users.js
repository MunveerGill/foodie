/**
 * Created by munveergill on 20/02/2017.
 */
/**
 * Created by munveergill on 15/02/2017.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
const util = require('util');
var recipes = require('../lib/recipe');


var app = express();
var urlss = [];
var count = 0;

var BBCcookie = "SESScd5bad1526f84ac397e532c006aca580=0X5TNmUA5I3QI42I4L0iir2bzcPdlto_f7-v81VmVc4";

const urls =  [
        'http://www.bbcgoodfood.com/user/1/saved-recipes',
        'http://www.bbcgoodfood.com/user/2/saved-recipes',
        'http://www.bbcgoodfood.com/user/3/saved-recipes',
        'http://www.bbcgoodfood.com/user/4/saved-recipes',
        'http://www.bbcgoodfood.com/user/5/saved-recipes',
        'http://www.bbcgoodfood.com/user/6/saved-recipes',
        'http://www.bbcgoodfood.com/user/7/saved-recipes',
        'http://www.bbcgoodfood.com/user/8/saved-recipes',
        'http://www.bbcgoodfood.com/user/9/saved-recipes',
        'http://www.bbcgoodfood.com/user/10/saved-recipes',
        'http://www.bbcgoodfood.com/user/11/saved-recipes',
        'http://www.bbcgoodfood.com/user/12/saved-recipes',
        'http://www.bbcgoodfood.com/user/13/saved-recipes',
        'http://www.bbcgoodfood.com/user/14/saved-recipes',
        'http://www.bbcgoodfood.com/user/15/saved-recipes',
        'http://www.bbcgoodfood.com/user/16/saved-recipes',
        'http://www.bbcgoodfood.com/user/17/saved-recipes',
        'http://www.bbcgoodfood.com/user/18/saved-recipes',
        'http://www.bbcgoodfood.com/user/19/saved-recipes',
        'http://www.bbcgoodfood.com/user/20/saved-recipes',
        'http://www.bbcgoodfood.com/user/21/saved-recipes',
        'http://www.bbcgoodfood.com/user/22/saved-recipes',
        'http://www.bbcgoodfood.com/user/23/saved-recipes',
        'http://www.bbcgoodfood.com/user/24/saved-recipes',
        'http://www.bbcgoodfood.com/user/25/saved-recipes',
        'http://www.bbcgoodfood.com/user/26/saved-recipes',
        'http://www.bbcgoodfood.com/user/27/saved-recipes',
        'http://www.bbcgoodfood.com/user/28/saved-recipes',
        'http://www.bbcgoodfood.com/user/29/saved-recipes',
        'http://www.bbcgoodfood.com/user/30/saved-recipes',
        'http://www.bbcgoodfood.com/user/31/saved-recipes',
        'http://www.bbcgoodfood.com/user/32/saved-recipes',
        'http://www.bbcgoodfood.com/user/33/saved-recipes',
        'http://www.bbcgoodfood.com/user/34/saved-recipes',
        'http://www.bbcgoodfood.com/user/35/saved-recipes',
        'http://www.bbcgoodfood.com/user/36/saved-recipes',
        'http://www.bbcgoodfood.com/user/37/saved-recipes',
        'http://www.bbcgoodfood.com/user/38/saved-recipes',
        'http://www.bbcgoodfood.com/user/39/saved-recipes',
        'http://www.bbcgoodfood.com/user/40/saved-recipes',
        'http://www.bbcgoodfood.com/user/41/saved-recipes',
        'http://www.bbcgoodfood.com/user/42/saved-recipes',
        'http://www.bbcgoodfood.com/user/43/saved-recipes',
        'http://www.bbcgoodfood.com/user/44/saved-recipes',
        'http://www.bbcgoodfood.com/user/45/saved-recipes',
        'http://www.bbcgoodfood.com/user/46/saved-recipes',
        'http://www.bbcgoodfood.com/user/47/saved-recipes',
        'http://www.bbcgoodfood.com/user/48/saved-recipes',
        'http://www.bbcgoodfood.com/user/49/saved-recipes'
];

var names = ["Leon Degree","Felicidad Dull","Timmy Yancey","Nilsa Swink","Candis Renfro","Willie Dildy","Lela Taft","Eileen Melendy","Kandace Both","Cheryll Stryker","Rodney Leahy","Louis Mcmenamin","Kenneth Messier","Cris Kreiger","Keven Twigg","Lynda Kinder","Marielle Culligan","Lona Mulhern","Jeniffer Lusher","Danna Koopman","Roosevelt Villacis","Richie Cacciatore","Chung Leitch","Shalonda Roddy","Lucina Dunagan","Ollie Tansey","Dale Neale","Cathey Twiss","Lindsey Ousley","Holly Espitia","Jeneva Bedsole","Jacinta Doughty","Shavonne Keeley","Gemma Patman","Margarito Sautner","Ha Colquitt","Golda Appelbaum","Deandrea Leishman","Shawnda Keesler","Alline Watlington","Reatha Greaver","Lucio Klingensmith","Sarina Steuck","Ayesha Tatman","Nicolas Alpaugh","Patrice Adkison","Luke Wynkoop","Clora Critchfield","Isadora Caspers","Floyd Lin"];

app.get('/scrape', function (req, res) {

    function getRecipe (url, callback){
        var options = { method: 'GET',
            url: url,
            headers:
            {
                Cookie: 'SESScd5bad1526f84ac397e532c006aca580=0X5TNmUA5I3QI42I4L0iir2bzcPdlto_f7-v81VmVc4'
            }
        };
        request(options, function (error, response, html) {
            if (error) throw new Error(error);

            var $ = cheerio.load(html);

            var json = {
                username: "test" + count++ +"@lamye.com",
                password: "",
                firstname: "test",
                lastname: "testing",
                likes: []
            };


            $('.node-title').each(function(i, el) {
                urlss.push(el.children[0].attribs);
                json.likes.push($(this).text().trim());
            });
            console.log(urlss);

            fs.appendFile('users.json', ',' + JSON.stringify(json, null, 4), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File successfully written');
                }
            });
        });



    }

    async.map(urls, getRecipe, function(err, res){
        console.log(urls);
        if(err) return console.log(err);
        console.log(res);


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
