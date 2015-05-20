angular.module('retro').service('Auth', ($localStorage, $cordovaOauth, OAUTH_KEYS, NewHero) => {
    return {
        facebook: {
            creds: () => {
                if($localStorage.facebookToken) {
                    $scope.auth.facebook.login();
                    return;
                }

                $cordovaOauth.facebook(OAUTH_KEYS.facebook, ['email']).then((result) => {
                    $localStorage.facebookToken = result.access_token; //jshint ignore:line
                    $scope.auth.facebook.login();
                }, (error) => {
                    window.alert('error ' + error);
                });
            },
            login: () => {
                $http.get(`https://graph.facebook.com/me?fields=id&access_token=${$localStorage.facebookToken}`)
                    .then(res => {
                        NewHero.facebookId = $localStorage.facebookId = res.data.id;
                        $scope.tryAuth();
                    });
            }
        }
    };
});