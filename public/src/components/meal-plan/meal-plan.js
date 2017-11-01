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
