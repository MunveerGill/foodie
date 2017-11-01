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
