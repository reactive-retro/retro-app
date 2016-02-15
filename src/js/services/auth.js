angular.module('retro').service('Auth', ($localStorage, $state, $ionicHistory, auth, AuthFlow) => {

    const localAuth = {
        login: () => {
            auth.signin({
                authParams: {
                    scope: 'openid offline_access email',
                    device: 'Mobile device'
                }
            }, (profile, token, accessToken, state, refreshToken) => {
                $localStorage.profile = profile;
                $localStorage.token = token;
                $localStorage.refreshToken = refreshToken;

                AuthFlow.tryAuth();
            }, (err) => {
                console.log('failed', JSON.stringify(err));
            });
        },
        logout: () => {
            auth.signout();
            $localStorage.profile = null;
            $localStorage.token = null;

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go('home');
        }
    };

    return localAuth;
});