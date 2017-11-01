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