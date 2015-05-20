angular.module('retro').service('Auth', ($http, $localStorage, $cordovaOauth, OAUTH_KEYS, NewHero, AuthFlow) => {

    var auth = {
        facebook: {
            creds: () => {
                if($localStorage.facebookToken) {
                    auth.facebook.login();
                    return;
                }

                $cordovaOauth.facebook(OAUTH_KEYS.facebook, ['email']).then((result) => {
                    $localStorage.facebookToken = result.access_token; //jshint ignore:line
                    auth.facebook.login();
                }, (error) => {
                    window.alert('error ' + error);
                });
            },
            login: () => {
                $http.get(`https://graph.facebook.com/me?fields=id&access_token=${$localStorage.facebookToken}`)
                    .then(res => {
                        NewHero.facebookId = $localStorage.facebookId = res.data.id;
                        AuthFlow.tryAuth();
                    });
            }
        }
    };

    return auth;
});