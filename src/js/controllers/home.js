angular.module('retro').controller('HomeController',
    ($scope, LocationWatcher, Auth, AuthData, BlockState) => {
        $scope.auth = Auth;

        const setAuthData = (data) => {
            $scope.authData = data;
            if(data.attemptAutoLogin && !BlockState.get().Login) {
                Auth.autoLogin();
            }
        };

        setAuthData(AuthData.get());
        AuthData.observer.then(null, null, setAuthData);
    }
);