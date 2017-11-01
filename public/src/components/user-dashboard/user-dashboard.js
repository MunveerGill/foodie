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