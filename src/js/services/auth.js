angular.module('retro').service('Auth', ($window, $localStorage, $stateWrapper, auth, AuthFlow, AuthData, Toaster) => {

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
                $stateWrapper.noGoingBackAndNoCache('home');
                window.onerror(err);
                Toaster.show(err.message);
            });
        },
        logout: () => {
            auth.signout();
            $localStorage.profile = null;
            $localStorage.token = null;

            AuthData.update({ attemptAutoLogin: false, isLoggedIn: false });

            $stateWrapper.noGoingBackAndNoCache('home');
            $window.location.reload(true);
        }
    };

    return localAuth;
});