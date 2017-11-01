/**
 * Created by munveergill on 29/01/2017.
 */
app.factory('UserCredentialsService', ['$cookies', '$httpParamSerializerJQLike', '$state', '$http', function ($cookies, $httpParamSerializerJQLike, $state, $http) {

    var LOGGED_IN_USER = "loggedInUser";

    var userCredentialsService = {};

    userCredentialsService.login = function(username, password) {
        var self = this;
        var API_ENDPOINT = "http://localhost:3000/login";
        var responsePromise = this.postEncodedData(API_ENDPOINT, {
            username: username,
            password: password
        });

        responsePromise.then(function(response) {
            if (response.status == 200) {
                var user = {
                    //sessionId: response.data.sessionId,
                    username: username
                };
                self.setUser(user);
            }
        });

        // return response so we can check any error states
        console.log(responsePromise)
        return responsePromise;
    };

    userCredentialsService.logout = function() {
        // just blank the data
        $cookies.remove(LOGGED_IN_USER);
        $state.transitionTo("login");
    };

    userCredentialsService.isAuthenticated = function () {
        var user = this.getUser() || {};
        return (user.username !== undefined);
    };

    userCredentialsService.postEncodedData = function(url, data) {
        data = $httpParamSerializerJQLike(data);

        return $http.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: "application/json"
            }
        }).then(function(response) {
            //on success
            return response;
        }, function(response) {
            //on error
            return response;
        });
    };

    userCredentialsService.getUser = function() {
        return $cookies.getObject(LOGGED_IN_USER);
    };

    userCredentialsService.setUser = function(userData) {
        $cookies.putObject(LOGGED_IN_USER, userData);
    };

    userCredentialsService.getHttpHeaders = function(){
        var headers = {'Accept': 'application/json'};
        var cookie = $cookies.getObject(LOGGED_IN_USER);

        if (cookie && cookie.username)  headers["X-Auth-Username"] = cookie.username;
        if (cookie && cookie.sessionId) headers["X-Auth-Session"]  = cookie.sessionId;

        return headers;
    };

    return userCredentialsService;
}]);