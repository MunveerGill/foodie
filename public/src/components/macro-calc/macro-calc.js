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
