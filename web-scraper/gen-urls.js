/**
 * Created by munveergill on 21/02/2017.
 */

function getUrls(number){
    var array = [];
    var url = "";
    for(var i = 1; i < number; i++){
        url = "http://www.bbcgoodfood.com/user/" + i + "/saved-recipes";
        array.push(url);
    }

    return array;

}

console.log(getUrls(50));