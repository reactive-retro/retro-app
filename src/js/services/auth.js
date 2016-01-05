angular.module('retro').service('Auth', ($localStorage, $state, auth, AuthFlow) => {

    var localAuth = {
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
        }
    };

    return localAuth;
});