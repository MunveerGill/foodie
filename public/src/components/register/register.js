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