angular.module('retro').service('Auth', ($localStorage, $stateWrapper, auth, AuthFlow) => {

    const localAuth = {
        autoLogin: () => AuthFlow.tryAutoLogin(),
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

            $stateWrapper.noGoingBack('home');
        }
    };

    return localAuth;
});