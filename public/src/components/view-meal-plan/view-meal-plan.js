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
