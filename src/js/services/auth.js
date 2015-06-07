angular.module('retro').service('Auth', ($http, $localStorage, $cordovaOauth, OAUTH_KEYS, NewHero, AuthFlow) => {

    var auth = {
        _cleanup: () => {
            _.each(['facebookId'], (key) => {
                delete $localStorage[key];
                delete NewHero[key];
            });
        },
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
                    console.log('FACEBOOK', error);
                });
            },
            login: () => {
                var fail = () => {
                    $http.get(`https://graph.facebook.com/me?fields=id&access_token=${$localStorage.facebookToken}`)
                        .then(res => {
                            NewHero.facebookId = $localStorage.facebookId = res.data.id;
                            AuthFlow.tryAuth();
                        });
                };

                if($localStorage.facebookId) {
                    AuthFlow.tryAuth();
                } else {
                    fail();
                }
            }
        }
    };

    return auth;
});