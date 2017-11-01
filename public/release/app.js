/**
 * Created by munveergill on 12/03/2016.
 */
var app = angular.module('app', ['ui.router','ui.bootstrap', 'ngCookies', 'ngMaterial']);

/**
 * Created by munveergill on 12/03/2016.
 */
app.config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "home-screen.html",
            controller: "HomeScreen"
        })
        .state('recipe', {
            url: "/recipe/{{selectedRecipeId}}",
            templateUrl: "recipe-screen.html",
            controller: "RecipeScreen"
        })
        .state('register', {
            url: "/register",
            templateUrl: "register-screen.html",
            controller: "RegisterScreen"
        })
        .state('login', {
            url: "/login",
            templateUrl: "login-screen.html",
            controller: "LoginScreen"
        })
        .state('user-dashboard', {
            url: "/user-dashboard",
            templateUrl: "user-dashboard-screen.html",
            controller: "UserDashboardScreen"
        })
        .state('macro-calculator', {
            url: "/macro-calculator",
            templateUrl: "macro-calc-screen.html",
            controller: "MacroCalcScreen"
        })
        .state('create-meal-plan', {
            url: "/create-meal-plan",
            templateUrl: "create-plan-screen.html",
            controller: "CreatePlanScreen"
        })
        .state('edit-meal-plan', {
            url: "/edit-meal-plan",
            templateUrl: "edit-meal-plan-screen.html",
            controller: "EditMealPlanScreen"
        })
        .state('view-meal-plan', {
            url: "/view-meal-plan",
            templateUrl: "view-meal-plan-screen.html",
            controller: "ViewMealPlanScreen"
        })
        .state('settings-plan', {
            url: "/settings",
            templateUrl: "settings-screen.html",
            controller: "SettingsScreen"
        })
        .state('recommendations', {
            url: "/recommendations",
            templateUrl: "recommendations-screen.html",
            controller: "RecommendationsScreen"
        });
});
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
/**
 * Created by munveergill on 08/03/2017.
 */
app.factory('restService', function ($http, $httpParamSerializerJQLike, UserCredentialsService) {

    const HEADER_USERNAME = 'X-Auth-Username';
    const HEADER_SESSION = 'X-Auth-Session';
    const HEADER_CONTENT_TYPE = 'Content-Type';
    const HEADER_ACCEPT = 'Accept';
    const HEADER_VALUE_ENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';
    const HEADER_VALUE_JSON_CONTENT_TYPE = 'application/json';

    var get = function (url) {

        return $http.get(url, {
                headers: getHeadersForSecureRequests(false, true)
            })

            .then(function (response) {
                // on success
                // console.log('success', response);
                return response;
            }, function (response) {
                // on error
                // console.log('fail', response);
                return response;
            });
    };


    var post = function (url, data, encoded, secure) {

        if (encoded) {
            data = $httpParamSerializerJQLike(data);
        }

        console.log("Posting data to URL: " + url);
        return $http.post(url, data, {
            headers: getHeadersForSecureRequests(encoded, secure)
        }).then(function (response) {
            //on success
            // console.log('success', response);
            return response;
        }, function (response) {
            //on error
            // console.log('fail', response);
            return response;
        });
    };

    function getHeadersForSecureRequests(encoded, secure) {
        var headers = {};
        if (secure) {
            headers[HEADER_USERNAME] = userCredentialsService.getUser().username;
            headers[HEADER_SESSION] = userCredentialsService.getUser().sessionId;
        }
        if (encoded) {
            headers[HEADER_CONTENT_TYPE] = HEADER_VALUE_ENCODED_CONTENT_TYPE;
        } else {
            headers[HEADER_CONTENT_TYPE] = HEADER_VALUE_JSON_CONTENT_TYPE;
        }
        headers[HEADER_ACCEPT] = HEADER_VALUE_JSON_CONTENT_TYPE;
        return headers;
    }

    return {
        get: get,
        post: post

    };
});



/**
 * Created by munveergill on 29/01/2017.
 */
app.factory('UserCredentialsService', ['$cookies', '$httpParamSerializerJQLike', '$state', '$http', function ($cookies, $httpParamSerializerJQLike, $state, $http) {

    var LOGGED_IN_USER = "loggedInUser";

    var userCredentialsService = {};

    userCredentialsService.login = function(username, password) {
        var self = this;
        var API_ENDPOINT = "http://localhost:3000/login";
        var responsePromise = this.postEncodedData(API_ENDPOINT, {
            username: username,
            password: password
        });

        responsePromise.then(function(response) {
            if (response.status == 200) {
                var user = {
                    //sessionId: response.data.sessionId,
                    username: username
                };
                self.setUser(user);
            }
        });

        // return response so we can check any error states
        console.log(responsePromise)
        return responsePromise;
    };

    userCredentialsService.logout = function() {
        // just blank the data
        $cookies.remove(LOGGED_IN_USER);
        $state.transitionTo("login");
    };

    userCredentialsService.isAuthenticated = function () {
        var user = this.getUser() || {};
        return (user.username !== undefined);
    };

    userCredentialsService.postEncodedData = function(url, data) {
        data = $httpParamSerializerJQLike(data);

        return $http.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: "application/json"
            }
        }).then(function(response) {
            //on success
            return response;
        }, function(response) {
            //on error
            return response;
        });
    };

    userCredentialsService.getUser = function() {
        return $cookies.getObject(LOGGED_IN_USER);
    };

    userCredentialsService.setUser = function(userData) {
        $cookies.putObject(LOGGED_IN_USER, userData);
    };

    userCredentialsService.getHttpHeaders = function(){
        var headers = {'Accept': 'application/json'};
        var cookie = $cookies.getObject(LOGGED_IN_USER);

        if (cookie && cookie.username)  headers["X-Auth-Username"] = cookie.username;
        if (cookie && cookie.sessionId) headers["X-Auth-Session"]  = cookie.sessionId;

        return headers;
    };

    return userCredentialsService;
}]);
/**
 * Created by munveergill on 04/03/2017.
 */
app.directive('createMealPlan', function () {
    return {
        templateUrl: 'create-meal-plan.html',
        scope: {},
        controller: 'createMealPlanController'
    }
});

app.controller('createMealPlanController', ['$scope', 'UserCredentialsService', '$state', "$http",'$mdDialog', '$cookies', function($scope, userCredentialsService, $state, $http, $mdDialog, $cookies) {

    $scope.form = {
        startDay: "",
        duration: "",
        checkbox :{
        breakfast: false,
        lunch: false,
        dinner: false
    }
    };

    $scope.next = function () {

        if($scope.form.duration == 0 || $scope.form.startDay.length === 0){
            console.log("error");
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Alert')
                    .textContent('Missing information')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent()
            );
        }else {
            console.log($scope.form.startDay);
            $cookies.putObject('createMealPlan', $scope.form);
            $state.go('edit-meal-plan');
        }

    }

}]);

'use strict';

app.directive('landingPage', function () {
    return {
        templateUrl: 'landing-page.html',
        scope: {},
        controller: 'landingPageController'
    }
});

app.controller('landingPageController', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

    $scope.search = {};
    $scope.recipeID = $stateParams.selectedRecipeId;
    $scope.searchClick = function(input){
        var newStr = input.replace(/\s+/g,'+');

        //console.log(newStr);

        $http.get("http://localhost:3000/recipes/" + newStr)
            .then(function(response) {
                $scope.x = response.data;
            });
    };
    $scope.pageSize = 10;

    $scope.more = function(x){
        //$scope.pageSize =+ 10;
        var increamented = $scope.pageSize + 10;
        $scope.pageSize = increamented > x.length ? x.length : increamented;
    }
}]);

/**
 * Created by munveergill on 29/01/2017.
 */
app.directive('login', function () {
    return {
        templateUrl: 'login.html',
        scope: {},
        controller: 'loginController'
    }
});

app.controller('loginController', ['$scope', '$stateParams', '$http', '$uibModal', '$state', 'UserCredentialsService', '$mdDialog', function($scope, $stateParams, $http, $uibModal, $state, userCredentialsService, $mdDialog) {

    //$scope.idNumber = $stateParams.selectedRecipeId;
    var json ={
        username: "",
        password: ""

    };

    $scope.login = function(email, password){

        userCredentialsService.login(email, password).then(function(response){
            if(response.status == 401){
                console.log("error");
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent('Please enter your credentials')
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent()
                );
            } else if(response.status == 404){
                console.log("error");
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent('Sorry, could not find you. Are you sure you have an account?')
                        .ariaLabel('Error')
                        .ok('Ok')
                        .targetEvent()
                );
            }
            else{
                $state.go('user-dashboard');
            }

        })

    };




}]);
/**
 * Created by munveergill on 02/02/2017.
 */
'use strict';

app.directive('macroCalc', function () {
    return {
        templateUrl: 'macro-calc.html',
        scope: {},
        controller: 'macroCalcController'
    }
});

app.controller('macroCalcController', ['$scope', 'UserCredentialsService', '$state', "$http", '$cookies', function($scope, userCredentialsService, $state, $http, $cookies) {

    var user = userCredentialsService.getUser();
    console.log(user.username);
    $scope.popup1 = {
        opened: false
    };
    $scope.format = 'dd/MM/yyyy';

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.formData = {};
    $scope.formData.username = user.username;

    function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.calculate = function(){

        var age = calculateAge($scope.formData.age);
        $scope.formData.age = age;
        var parameter = JSON.stringify($scope.formData);
        $http.post("http://localhost:3000/macros", parameter)
            .then(function(response) {
                console.log(response.status);
                if(response.status == 200){
                    console.log("we made it");
                }
            });

        console.log($scope.formData);
        $state.go("user-dashboard");

    };



}]);

/**
 * Created by munveergill on 27/02/2017.
 */

app.directive('mealPlan', function () {
    return {
        templateUrl: 'meal-plan.html',
        scope: {},
        controller: 'mealPlanController'
    }
});

app.controller('mealPlanController', ['$scope', 'UserCredentialsService', '$state', "$http", '$cookies','$mdDialog', '$uibModal','$uibModalStack','restService', function($scope, userCredentialsService, $state, $http, $cookies, $mdDialog, $uibModal, $uibModalStack, restService) {
    var cookieWObject = $cookies.getObject('createMealPlan');
    var username = $cookies.getObject('loggedInUser');
    $scope.breakfastArray;
    $scope.clickedLikes = false;
    $scope.clickedOut = false;
    $scope.searchClicked = false;
    $scope.clickedInputIngredients = false;

    var cookies = userCredentialsService.getUser();
    //console.log(cookieWObject);
    $scope.formData = {
        dinner: []
    };

    $scope.mealsType = cookieWObject.checkbox;

    var date = cookieWObject.startDay.substring(0,10);
    $scope.startDate = moment(date, "YYYY-MM-DD").format('dddd, MMMM Do YYYY');

    var getAllDays = function (numberOfDays) {
        var arrayOfDays = [];
        for(var i=0; i<numberOfDays; i++){
            arrayOfDays.push(moment(date, "YYYY-MM-DD").add(i, 'days').format('dddd, MMMM Do YYYY'));
        }
        return arrayOfDays;
    };

    $http.get("http://localhost:3000/meals/" + username.username)
        .then(function(response) {
            $scope.x = response.data;
            getBreakfastArray($scope.x.breakfast);
            getLunchArray($scope.x.lunch);
            getDinnerArray($scope.x.dinner);
        });
    $scope.days = getAllDays(cookieWObject.duration);
    $scope.endDate = moment(date, "YYYY-MM-DD").add(cookieWObject.duration, 'days').format('dddd, MMMM Do YYYY');

    var getBreakfastArray = function (value) {
        if($scope.mealsType.breakfast == false){
            $scope.breakfastArray = [];
        }
        else{
            value.sort(function(a, b){return 0.5 - Math.random()});
            $scope.breakfastArray = value;
        }
        //console.log( $scope.breakfastArray );
    };
    var getLunchArray = function (value) {
        if($scope.mealsType.lunch == false){
            $scope.lunchArray = [];
        }
        else{
            value.sort(function(a, b){return 0.5 - Math.random()});
            $scope.lunchArray = value;
        }
        //console.log( $scope.lunchArray );
    };
    var getDinnerArray = function (value) {
        if($scope.mealsType.dinner == false){
            $scope.dinnerArray = [];
        }else{
            value.sort(function(a, b){return 0.5 - Math.random()});
            $scope.dinnerArray = value;
        }
        //console.log( $scope.dinnerArray );
    };
    $scope.save = function (ev) {
        var breakfast = $scope.breakfastArray;
        var og = breakfast.slice(0, cookieWObject.duration);
        var lunch = $scope.lunchArray;
        var og2 = lunch.slice(0, cookieWObject.duration);
        var dinner = $scope.dinnerArray;
        var og3= dinner.slice(0, cookieWObject.duration);

        var m = cookieWObject.duration;
        //console.log(og3);

        if(og.length < m || og2.length < m || og3.length < m){
            console.log("not enough meals mate");
                var confirm = $mdDialog.confirm()
                    .title('Are you sure to save this meal plan?')
                    .textContent('You will not be able to edit this later')
                    .ariaLabel('')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {
                    var obj = {
                        username: username.username,
                        breakfast: og,
                        lunch: og2,
                        dinner: og3,
                        duration: cookieWObject.duration,
                        startDay: cookieWObject.startDay
                    };
                    restService.post('http://localhost:3000/post-meal',obj);
                    console.log(obj);
                    $cookies.remove('createMealPlan');
                    $state.go('user-dashboard', {}, {reload: 'view-meal-plan'});
                }, function() {
                    $scope.status = 'You decided to keep your record.';
                });

        }
        else{

            var obj = {
                username: username.username,
                breakfast: og,
                lunch: og2,
                dinner: og3,
                duration: cookieWObject.duration,
                startDay: cookieWObject.startDay
            };
            restService.post('http://localhost:3000/post-meal',obj);
            console.log(obj);
            $cookies.remove('createMealPlan');
            $state.go('view-meal-plan');
        }


    };

    $scope.refresh = function(meal,index){
        if(meal == 'Breakfast'){
            $scope.breakfastArray[index] = $scope.breakfastArray[Math.floor(Math.random() * $scope.breakfastArray.length)];
        }
        if(meal == 'Lunch'){
            var random = $scope.lunchArray[Math.floor(Math.random() * $scope.lunchArray.length)];
            $scope.lunchArray[index] = random;

        }
        if(meal == 'Dinner'){
            $scope.dinnerArray[index] = $scope.dinnerArray[Math.floor(Math.random() * $scope.dinnerArray.length)]
        }
    };

    // gets the value of the recipe in the likes part
    $scope.replace = function(index){
        $scope.replaceAtIndex = index;
        //console.log($scope.replaceAtIndex);

        $http.get("http://localhost:3000/get-recipe/" + $scope.usersLikes[$scope.replaceAtIndex])
            .then(function(response) {

                $scope.recipeData = response.data[0];

                if($scope.meal == 'Breakfast'){
                    $scope.breakfastArray[$scope.indexValue] = $scope.recipeData ;
                }
                if($scope.meal == 'Lunch'){
                    $scope.lunchArray[$scope.indexValue] = $scope.recipeData ;
                }
                if($scope.meal == 'Dinner'){
                    $scope.dinnerArray[$scope.indexValue] = $scope.recipeData ;
                }

            });
        $scope.clickedLikes = false;
        $uibModalStack.dismissAll();
    };


    $scope.likes = function(index){
        var ind = index;
        $scope.clickedLikes = true;
        $http.get("http://localhost:3000/get-user/" + cookies.username)
            .then(function(response) {
                $scope.usersLikes = response.data[0].likes;
                //console.log($scope.replaceAtIndex);
                //console.log($scope.breakfastArray);
            });
        //console.log($scope.indexValue, $scope.meal);
    };

    $scope.out = function(index){
        $scope.clickedOut = true;
        var obj = {
            name: "Eating out",
            ingredients: [],
            nutrition: {
                calories:0,
                carbohydrates:0,
                cholesterol:0,
                fiber: 0,
                protein: 0,
                saturatedFat:0,
                sodium:0,
                sugar: 0,
                totalFat: 0
            }
        };
        if($scope.meal == 'Breakfast'){
            //console.log($scope.indexValue);
            //console.log($scope.meal);
            $scope.breakfastArray[$scope.indexValue] = obj ;
            //console.log($scope.breakfastArray);
        }
        if($scope.meal == 'Lunch'){
            //console.log($scope.indexValue);

            $scope.lunchArray[$scope.indexValue] = obj ;
            //console.log($scope.lunchArray)
        }
        if($scope.meal == 'Dinner'){
            //console.log($scope.indexValue);

            $scope.dinnerArray[$scope.indexValue] = obj ;
        }
        //console.log($scope.meal);
        $uibModalStack.dismissAll();

    };

    $scope.remove = function (meal, index) {
        //console.log($scope.breakfastArray[index]);
        $scope.checked = true;
        var instance = $uibModal.open({
            animation: true,
            templateUrl: 'delete-modal.html',
            size: '',
            scope: $scope
        });
        instance.result.then(function(){
            //Get triggers when modal is closed
            $scope.clickedLikes = false;
            $scope.clickedOut = false;
            $scope.searchClicked = false;
            $scope.clickedInputIngredients = false;
        }, function(){
            //gets triggers when modal is dismissed.
            $scope.clickedLikes = false;
            $scope.clickedOut = false;
            $scope.searchClicked = false;
            $scope.clickedInputIngredients = false;
        });
        $scope.indexValue = index;
        $scope.meal = meal;

    };

    $scope.search = function(index){
        $scope.searchClicked = true;
        $scope.searchClick = function(input){
            var newStr = input.replace(/\s+/g,'+');
            $http.get("http://localhost:3000/recipes/" + newStr)
                .then(function(response) {
                    $scope.x = response.data;
                    getSearchRecipeArray($scope.x);
                });
        };

        var getSearchRecipeArray = function(recipes){
            $scope.searchRecipeArray = recipes;
        };

        $scope.add = function (index){
            //console.log($scope.indexValue, $scope.meal,index);
            if($scope.meal == 'Breakfast'){
                $scope.breakfastArray[$scope.indexValue] = $scope.searchRecipeArray[index];
            }
            if($scope.meal == 'Lunch'){
                $scope.lunchArray[$scope.indexValue] = $scope.searchRecipeArray[index];

            }
            if($scope.meal == 'Dinner'){
                $scope.dinnerArray[$scope.indexValue] = $scope.searchRecipeArray[index];
            }
            $scope.searchClicked = false;
            $uibModalStack.dismissAll();

        }
    };

    $scope.addIngredients = function(){

        for(var i=0; i< $scope.choices.length; i++){
            if($scope.meal == 'Breakfast'){
                $scope.breakfastArray[$scope.indexValue] = $scope.choices[i];
            }
            if($scope.meal == 'Lunch'){
                $scope.lunchArray[$scope.indexValue] = $scope.choices[i];
            }
            if($scope.meal == 'Dinner'){
                $scope.dinnerArray[$scope.indexValue] = $scope.choices[i];
            }
        }

        console.log($scope.choices);
        $scope.choices = [{id: 'ingredient1'}];
        $uibModalStack.dismissAll();


    };


    $scope.own = function(index){
        $scope.clickedInputIngredients = true;
        console.log(index);
    };
    $scope.choices = [{id: 'ingredient1'}];

    $scope.addNewChoice = function() {
        var newItemNo = $scope.choices.length+1;
        $scope.choices.push({'id':'ingredient'+newItemNo});
    };

    $scope.removeChoice = function() {
        var lastItem = $scope.choices.length-1;
        $scope.choices.splice(lastItem);
    };


    $scope.print = function() {
        window.print();
    };

    $scope.myFunc = function (value1, value2, value3){

        var a  = parseInt(value1);
        if(isNaN(a)) a = 0;
        var b  = parseInt(value2);
        if(isNaN(b)) a = 0;
        var c  = parseInt(value3);
        if(isNaN(c)) a = 0;
        var hi = a+b+c;
        return hi;
    };
    $scope.calcMacros = function (value1, value2, value3){

        var og1 =0;
        var og2 =0;
        var og3 =0;
        if (undefined != value1) { if(typeof value1 === 'string'){og1 = value1.replace(/g/i, "")} else{ og1 = value1} }
        if (undefined != value2) { if(typeof value2 === 'string'){og2 = value2.replace(/g/i, "")} else{ og2 = value2} }
        if (undefined != value3) { if(typeof value3 === 'string'){og3 = value3.replace(/g/i, "")} else{ og3 = value3} }
        var a  = parseInt(og1);
        if(isNaN(a)) a = 0;
        var b  = parseInt(og2);
        if(isNaN(b)) b = 0;
        var c  = parseInt(og3);
        if(isNaN(c)) c = 0;
        var hi = a+b+c;
        return hi;
    }

    $scope.delete = function(meal, index){
        var obj = {
            name: "",
            ingredients: [],
            nutrition: {
                calories:0,
                carbohydrates:0,
                cholesterol:0,
                fiber: 0,
                protein: 0,
                saturatedFat:0,
                sodium:0,
                sugar: 0,
                totalFat: 0
            }
        };
        if(meal == 'Breakfast'){
            //console.log($scope.indexValue);
            console.log(meal);
            $scope.breakfastArray[index] = obj ;
            console.log($scope.breakfastArray);
        }
        if(meal == 'Lunch'){
            //console.log($scope.indexValue);

            $scope.lunchArray[index] = obj ;
            //console.log($scope.lunchArray)
        }
        if(meal == 'Dinner'){
            //console.log($scope.indexValue);

            $scope.dinnerArray[index] = obj ;
        }


    }

}]);

/**
 * Created by munveergill on 12/03/2016.
 */
'use strict';

app.directive('navBar', function () {
    return {
        templateUrl: 'nav-bar.html',
        scope: {},
        controller: 'navBarController'
    }
});

app.controller('navBarController', ['$scope', 'UserCredentialsService', '$state', "$http", function($scope, userCredentialsService, $state, $http) {

    $scope.loggedIN = userCredentialsService.isAuthenticated();

    $scope.logout = function(){
        $http.get("http://localhost:3000/logout/")
            .then(function(response) {
                userCredentialsService.logout();
                //$scope.loggedIN = false;
                //$state.go('home');
            });
    };

}]);

/**
 * Created by munveergill on 18/01/2017.
 */
app.directive('recipeDetails', function () {
    return {
        templateUrl: 'recipe-details.html',
        scope: {},
        controller: 'recipeDetailsController'
    }
});

app.controller('recipeDetailsController', ['$scope', '$stateParams', '$http', 'UserCredentialsService','$mdDialog', function($scope, $stateParams, $http, userCredentialsService, $mdDialog) {

    $scope.review = {};
    $scope.review.liked = false;
    $scope.idNumber = $stateParams.selectedRecipeId;
    var user = userCredentialsService.getUser();
    if(user != undefined){
        $scope.user = user.username;
        $scope.review.username = $scope.user;
    }


    $http.get("http://localhost:3000/getrecipe/" + $scope.idNumber)
        .then(function(response) {
            $scope.x = response.data[0];
            //$scope.x.instructions.replace(/\.(\s+)[A-Z]/g, '<br>');
            submitReview(response.data[0].name);
            $http.get("http://localhost:3000/get-reviews/" + $scope.x.name)
                .then(function(response) {
                    $scope.reviews = response.data;
                });
        });


    var submitReview = function(name){
        $scope.review.recipeName = name;
    };

    $scope.submit = function(ev){
        console.log($scope.review);
        if($scope.review.description.length > 0){
            $http.post("http://localhost:3000/post-review", $scope.review)
                .then(function(response) {
                    console.log(response.status);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title("Submitted review")
                            .textContent('Thanks!')
                            .ariaLabel('Submitted')
                            .ok('Cool!')
                            .targetEvent(ev)
                    );
                });
        }
    }

    $scope.isString = function(val) {
        if(typeof val == 'string'){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.like = function(name, ev){
        if(user === undefined){
            console.log("not logged in");
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title("Not logged in")
                    .textContent('Login or create an account, to like recipes')
                    .ariaLabel('Submitted')
                    .ok('Ok')
                    .targetEvent(ev)
            );
        }
        else{
            var postLike = {
                username: user.username,
                likes: name
            };
            $http.post("http://localhost:3000/like", postLike)
                .then(function(response) {
                    console.log(response.status);
                });
        }
    }


}]);

/**
 * Created by munveergill on 19/03/2017.
 */
app.directive('recommendations', function () {
    return {
        templateUrl: 'recommendations.html',
        scope: {},
        controller: 'recommendationsController'
    }
});

app.controller('recommendationsController', ['$scope', '$stateParams', '$http', 'UserCredentialsService','$mdDialog', function($scope, $stateParams, $http, userCredentialsService, $mdDialog) {

    var cookies = userCredentialsService.getUser();

    $http.get("http://localhost:3000/meals/" + cookies.username)
        .then(function(response) {
            $scope.recommendations = response.data.breakfast;
            $scope.lunch = response.data.lunch;
            $scope.dinner = response.data.dinner;

            console.log($scope.recommendations);
            $scope.lunch.sort(function(a, b){return 0.5 - Math.random()});
            $scope.recommendations.sort(function(a, b){return 0.5 - Math.random()});
            $scope.dinner.sort(function(a, b){return 0.5 - Math.random()});

            $scope.recommendations.splice(5);
            $scope.lunch.splice(5);
            $scope.dinner.splice(5);
            //console.log($scope.recommendations);
        });

}]);

/**
 * Created by munveergill on 26/01/2017.
 */
app.directive('register', function () {
    return {
        templateUrl: 'register.html',
        scope: {},
        controller: 'registerController'
    }
});

app.controller('registerController', ['$scope', '$stateParams', '$http', '$uibModal', '$state', 'UserCredentialsService', '$mdDialog', function($scope, $stateParams, $http, $uibModal, $state, userCredentialsService, $mdDialog) {

    //$scope.idNumber = $stateParams.selectedRecipeId;
    var json ={
        username: "",
        password: "",
        firstname: ""
    };

    $scope.register = function(email, password, firstname){
        json.username = email;
        json.password = password;
        json.firstname = firstname;

        console.log(json);

        if(json.username === undefined || json.password === undefined || json.firstname === undefined){
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('oops')
                    .textContent('oops! Looks like you missed a field')
                    .ariaLabel('Error')
                    .ok('Ok')
                    .targetEvent()
            );
        }
        else
        {
            $http.post("http://localhost:3000/register", json)
                .then(function(response) {
                    //$scope.x = response.data[0];
                    console.log(response.status);
                    if(response.status == 200){
                        showSuccessResponse(response);
                        //userCredentialsService.login(response.username, response.password);
                        //return;
                    }
                });
        }
    };

    function showSuccessResponse(response) {

        console.log("Successfully registered " + response.status);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'success-modal.html',
            size: '',
            scope: $scope
        });

        $scope.ok = function () {
            modalInstance.close();
            $state.go('login');
        };
    }



}]);
/**
 * Created by munveergill on 14/03/2017.
 */
app.directive('settingsPage', function () {
    return {
        templateUrl: 'settings-page.html',
        scope: {},
        controller: 'settingsPageController'
    }
});

app.controller('settingsPageController', ['$scope', '$stateParams', '$http', '$uibModal', '$state', 'UserCredentialsService','$mdDialog', '$cookies', function($scope, $stateParams, $http, $uibModal, $state, userCredentialsService, $mdDialog, $cookies) {

    var user = userCredentialsService.getUser();



    $http.get("http://localhost:3000/get-user/" + user.username)
        .then(function(response) {
            $scope.x = response.data[0];
            console.log($scope.x);
        });

    $scope.submit = function(value){
        value.oldusername = user.username;
        $http.post("http://localhost:3000/update-settings", value)
            .then(function(response) {
                console.log(response.status);
                if(response.status == 200){
                    //$cookies.put('loggedInUser', value.username);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Success')
                            .textContent('Settings have been updated')
                            .ariaLabel('Success')
                            .ok('Awesome!')
                            .targetEvent()
                    );
                }
                else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Alert')
                            .textContent('Missing information')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent()
                    );
                }

            });
    }


}]);
/**
 * Created by munveergill on 12/03/2016.
 */
'use strict';

app.directive('userDashboard', function () {
    return {
        templateUrl: 'user-dashboard.html',
        scope: {},
        controller: 'userDashboardController'
    }
});

app.controller('userDashboardController', ['$scope', 'UserCredentialsService', '$state', "$http", '$cookies','constantsService','$uibModal', '$uibModalStack', '$stateParams', function($scope, userCredentialsService, $state, $http, $cookies, constantsService, $uibModal, $uibModalStack, $stateParams) {

    var cookies = userCredentialsService.getUser();
    $scope.likeArray = [];
    $scope.recipeID = $stateParams.selectedRecipeId;
    $scope.loggedIn = userCredentialsService.isAuthenticated();

    $scope.diets = constantsService.getDietaryRequirements();

    $scope.providedPersonalisedInfo = false;

    var today = new Date();

    $http.get("http://localhost:3000/get-user/" + cookies.username)
        .then(function(response) {
            $scope.x = response.data[0];
            //console.log($scope.x.bmr);
            if(typeof $scope.x.bmr === "undefined"){
                $scope.providedPersonalisedInfo = true;
            }
            //console.log($scope.x.bmr);
            if( $scope.x.likes.length < 10){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'likes-modal.html',
                    size: '',
                    scope: $scope
                });
            }
            else {
                $http.get("http://localhost:3000/meals/" + cookies.username)
                    .then(function(response) {
                        $scope.recommendations = response.data.lunch;
                        console.log($scope.recommendations);
                        $scope.recommendations.splice(5);
                        //console.log($scope.recommendations);
                    });
            }
        });

    $scope.readonly = false;
    $scope.error = false;

    $scope.checkbox = {
        username: cookies.username,
        allergies: {
            dairyFree: false,
            nutAllergy: false,
            vegan: false,
            diabetic: false,
            halal: false,
            kosher: false,
            vegetarian: false,
            other: []
        }
    };

    $scope.currentStep = 0;

    $scope.next = function (checkbox) {

        //console.log(checkbox);
        $http.post('http://localhost:3000/set-user-data', checkbox, {
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json"
            }}).then(function (response) {
        // This function handles success
            console.log("success");

            $http.get("http://localhost:3000/initial-rec/" + cookies.username)
                .then(function(response) {
                    $scope.recc = response.data;
                    console.log($scope.recc);
                });

        }, function (response) {
        // this function handles error
            console.log("error");
        });

        $scope.currentStep += 1;


    };



    $scope.stepForward = function () {
        $scope.currentStep += 1;
    };

    $scope.showStep = function (step) {
        return step == $scope.currentStep;
    };

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };
    $scope.progressBar = 0;

    $scope.likes = function (value) {

        var foundSimilar = $scope.likeArray.includes(value);

        if(!foundSimilar){

        $scope.likeArray.push(value);
        $scope.progressBar = ($scope.likeArray.length / 10)*100;
        console.log($scope.progressBar);
        console.log($scope.likeArray);

        $scope.left = 10 - $scope.likeArray.length;
        }

        if($scope.likeArray.length == 10){
            $scope.disabled = false;
        }
    };

    var likesObject = {
        username: cookies.username,
        likes: $scope.likeArray
    };


    $scope.submitLikes = function(){
        if($scope.likeArray.length >= 10){
            $http.post('http://localhost:3000/likes', likesObject, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json"
                }}).then(function (response) {
                $uibModalStack.dismissAll();



            }, function (response) {
                // this function handles error
                console.log("error");
            });
        }
        else{
            $scope.error = true;
        }
    };

    $scope.colour = function(name){
       return $scope.likeArray.includes(name);
    };
    //var url = "http://localhost:3000/calculate-macros/" + cookies.username;
    //
    //
    //$http.get(url)
    //    .then(function(response) {
    //        $scope.meal = response.data;
    //    });

}]);
/**
 * Created by munveergill on 11/03/2017.
 */
app.directive('viewMealPlan', function () {
    return {
        templateUrl: 'view-meal-plan.html',
        scope: {},
        controller: 'viewMealPlanController'
    }
});

app.controller('viewMealPlanController', ['$scope', 'UserCredentialsService', '$state', "$http",'restService','$mdDialog', function($scope, userCredentialsService, $state, $http, restService, $mdDialog) {

    var user = userCredentialsService.getUser();
    $scope.getAllDays = function (startDay, numberOfDays, index) {
        //startDay = startDay.substring(0,10);
        console.log("start day " + startDay);
        var arrayOfDays = [];
        for(var i=0; i<numberOfDays; i++){
            arrayOfDays.push(moment(startDay, "YYYY-MM-DD").add(i, 'days').format('dddd, MMMM Do YYYY'));
        }
        console.log(arrayOfDays);
        return arrayOfDays[index];
    };
    $scope.data ={};

    var url = 'http://localhost:3000/get-meals/' + user.username;
    $scope.me = [];
    $http.get(url)
        .then(function(response) {
            $scope.x = response.data;
            for(var i=0; i<$scope.x.length; i++){
                $scope.me.push($scope.x[i]);
            }
            $scope.chosen = $scope.me[0];
            console.log($scope.chosen);
            getBreakfastArray($scope.chosen.breakfast);
            getLunchArray($scope.chosen.lunch);
            getDinnerArray($scope.chosen.dinner);

        });

    //$scope.chosen = $scope.me[0].startDay;
    var getBreakfastArray = function (value) {
            $scope.breakfastArray = value;
        //console.log( $scope.breakfastArray );
    };

    var getLunchArray = function (value) {
        $scope.lunchArray = value;
        //console.log( $scope.lunchArray );
    };

    var getDinnerArray = function (value) {
        $scope.dinnerArray = value;
        //console.log( $scope.dinnerArray );
    };
    var getMeals = function(date){

        for(var j=0; j<$scope.me.length; j++){
            if($scope.me[i].startDay === $scope.chosen){
                console.log($scope.me[i]);
            }
        }

    };
    $scope.showPrompt = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title('What did you eat?')
            .textContent('Enter the carbs, protein and fats')
            .placeholder('')
            .ariaLabel('Dog name')
            .initialValue('')
            .targetEvent(ev)
            .ok('Submit!')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function(result) {
            $scope.status = 'You decided to name your dog ' + result + '.';
        }, function() {
            $scope.status = 'You didn\'t name your dog.';
        });
    };


}]);

/**
 * Created by munveergill on 27/02/2017.
 */
app.controller('CreatePlanScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});

app.controller('CreateScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});

/**
 * Created by munveergill on 04/03/2017.
 */
app.controller('EditMealPlanScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 12/03/2016.
 */
app.controller('HomeScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 29/01/2017.
 */
app.controller('LoginScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 02/02/2017.
 */
app.controller('MacroCalcScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 18/01/2017.
 */
app.controller('RecipeScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 19/03/2017.
 */
app.controller('RecommendationsScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 26/01/2017.
 */
app.controller('RegisterScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 14/03/2017.
 */
app.controller('SettingsScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 30/01/2017.
 */
app.controller('UserDashboardScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});
/**
 * Created by munveergill on 11/03/2017.
 */
app.controller('ViewMealPlanScreen', function ($scope, $state) {

    var init = function () {

    };

    init();
});