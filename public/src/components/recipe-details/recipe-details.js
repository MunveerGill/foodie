/**
 * Created by munveergill on 18/01/2017.
 */
app.directive('recipeDetails', function () {
    return {
        templateUrl: 'recipe-details.html',
        scope: {},
        controller: 'recipeDetailsController'
    }
});

app.controller('recipeDetailsController', ['$scope', '$stateParams', '$http', 'UserCredentialsService','$mdDialog', function($scope, $stateParams, $http, userCredentialsService, $mdDialog) {

    $scope.review = {};
    $scope.review.liked = false;
    $scope.idNumber = $stateParams.selectedRecipeId;
    var user = userCredentialsService.getUser();
    if(user != undefined){
        $scope.user = user.username;
        $scope.review.username = $scope.user;
    }


    $http.get("http://localhost:3000/getrecipe/" + $scope.idNumber)
        .then(function(response) {
            $scope.x = response.data[0];
            //$scope.x.instructions.replace(/\.(\s+)[A-Z]/g, '<br>');
            submitReview(response.data[0].name);
            $http.get("http://localhost:3000/get-reviews/" + $scope.x.name)
                .then(function(response) {
                    $scope.reviews = response.data;
                });
        });


    var submitReview = function(name){
        $scope.review.recipeName = name;
    };

    $scope.submit = function(ev){
        console.log($scope.review);
        if($scope.review.description.length > 0){
            $http.post("http://localhost:3000/post-review", $scope.review)
                .then(function(response) {
                    console.log(response.status);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title("Submitted review")
                            .textContent('Thanks!')
                            .ariaLabel('Submitted')
                            .ok('Cool!')
                            .targetEvent(ev)
                    );
                });
        }
    }

    $scope.isString = function(val) {
        if(typeof val == 'string'){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.like = function(name, ev){
        if(user === undefined){
            console.log("not logged in");
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title("Not logged in")
                    .textContent('Login or create an account, to like recipes')
                    .ariaLabel('Submitted')
                    .ok('Ok')
                    .targetEvent(ev)
            );
        }
        else{
            var postLike = {
                username: user.username,
                likes: name
            };
            $http.post("http://localhost:3000/like", postLike)
                .then(function(response) {
                    console.log(response.status);
                });
        }
    }


}]);
