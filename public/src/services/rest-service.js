/**
 * Created by munveergill on 08/03/2017.
 */
app.factory('restService', function ($http, $httpParamSerializerJQLike, UserCredentialsService) {

    const HEADER_USERNAME = 'X-Auth-Username';
    const HEADER_SESSION = 'X-Auth-Session';
    const HEADER_CONTENT_TYPE = 'Content-Type';
    const HEADER_ACCEPT = 'Accept';
    const HEADER_VALUE_ENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';
    const HEADER_VALUE_JSON_CONTENT_TYPE = 'application/json';

    var get = function (url) {

        return $http.get(url, {
                headers: getHeadersForSecureRequests(false, true)
            })

            .then(function (response) {
                // on success
                // console.log('success', response);
                return response;
            }, function (response) {
                // on error
                // console.log('fail', response);
                return response;
            });
    };


    var post = function (url, data, encoded, secure) {

        if (encoded) {
            data = $httpParamSerializerJQLike(data);
        }

        console.log("Posting data to URL: " + url);
        return $http.post(url, data, {
            headers: getHeadersForSecureRequests(encoded, secure)
        }).then(function (response) {
            //on success
            // console.log('success', response);
            return response;
        }, function (response) {
            //on error
            // console.log('fail', response);
            return response;
        });
    };

    function getHeadersForSecureRequests(encoded, secure) {
        var headers = {};
        if (secure) {
            headers[HEADER_USERNAME] = userCredentialsService.getUser().username;
            headers[HEADER_SESSION] = userCredentialsService.getUser().sessionId;
        }
        if (encoded) {
            headers[HEADER_CONTENT_TYPE] = HEADER_VALUE_ENCODED_CONTENT_TYPE;
        } else {
            headers[HEADER_CONTENT_TYPE] = HEADER_VALUE_JSON_CONTENT_TYPE;
        }
        headers[HEADER_ACCEPT] = HEADER_VALUE_JSON_CONTENT_TYPE;
        return headers;
    }

    return {
        get: get,
        post: post

    };
});


