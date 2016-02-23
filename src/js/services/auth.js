angular.module('retro').service('Auth', ($localStorage, $stateWrapper, auth, AuthFlow, AuthData) => {

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

            AuthData.update({ attemptAutoLogin: false, isLoggedIn: false });

            $stateWrapper.noGoingBackAndNoCache('home');
        }
    };

    return localAuth;
});