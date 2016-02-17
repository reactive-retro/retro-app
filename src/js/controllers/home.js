angular.module('retro').controller('HomeController',
    ($scope, LocationWatcher, Auth, AuthData) => {
        $scope.auth = Auth;
        $scope.authData = AuthData.get();

        AuthData.observer.then(null, null, val => {
            $scope.authData = val;
            if(val.attemptAutoLogin) {
                Auth.autoLogin();
            }
        });
    }
);