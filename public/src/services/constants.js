/**
 * Created by munveergill on 10/02/2017.
 */
app.factory('constantsService', function () {

    var dietaryRequirements = [
        "Peanut allergy",
        "Dairy Free",
        "Vegan",
        "Diabetic",
        "Halal Diet",
        "Kosher Diet"
    ];


    return {
        getDietaryRequirements: function () {

            return dietaryRequirements;
        }
    }
});