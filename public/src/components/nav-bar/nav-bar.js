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
