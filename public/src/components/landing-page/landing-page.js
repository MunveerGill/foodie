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
