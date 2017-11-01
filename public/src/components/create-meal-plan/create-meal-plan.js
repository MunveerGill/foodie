/**
 * Created by munveergill on 04/03/2017.
 */
app.directive('createMealPlan', function () {
    return {
        templateUrl: 'create-meal-plan.html',
        scope: {},
        controller: 'createMealPlanController'
    }
});

app.controller('createMealPlanController', ['$scope', 'UserCredentialsService', '$state', "$http",'$mdDialog', '$cookies', function($scope, userCredentialsService, $state, $http, $mdDialog, $cookies) {

    $scope.form = {
        startDay: "",
        duration: "",
        checkbox :{
        breakfast: false,
        lunch: false,
        dinner: false
    }
    };

    $scope.next = function () {

        if($scope.form.duration == 0 || $scope.form.startDay.length === 0){
            console.log("error");
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
        }else {
            console.log($scope.form.startDay);
            $cookies.putObject('createMealPlan', $scope.form);
            $state.go('edit-meal-plan');
        }

    }

}]);
