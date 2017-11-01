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