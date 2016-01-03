angular.module('retro').service('Auth', ($http, $localStorage, $cordovaOauth, OAUTH_KEYS, NewHero, AuthFlow) => {

    var auth = {
        _cleanup: (except = []) => {
            _.each(_.difference(['facebookId', 'googleId'], except), (key) => {
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
                            AuthFlow.tryAuth('facebook');
                        });
                };

                if($localStorage.facebookId) {
                    AuthFlow.tryAuth('facebook');
                } else {
                    fail();
                }
            }
        },
        google: {
            creds: () => {
                if($localStorage.googleToken) {
                    auth.google.login();
                    return;
                }

                $cordovaOauth.google(OAUTH_KEYS.google, ['email', 'profile']).then((result) => {
                    $localStorage.googleToken = result.access_token; //jshint ignore:line
                    auth.google.login();
                }, (error) => {
                    console.log('GOOGLE', error);
                });
            },
            login: () => {
                var fail = () => {
                    $http.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${$localStorage.googleToken}`)
                        .then(res => {
                            NewHero.googleId = $localStorage.googleId = res.data.email;
                            AuthFlow.tryAuth('google');
                        });
                };

                if($localStorage.googleId) {
                    AuthFlow.tryAuth('google');
                } else {
                    fail();
                }
            }
        }
    };

    return auth;
});