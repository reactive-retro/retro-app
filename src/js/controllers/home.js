angular.module('retro').controller('HomeController',
    ($scope, LocationWatcher, Auth, AuthData) => {
        $scope.auth = Auth;
        $scope.authData = AuthData.get();


        $scope.coords = LocationWatcher.current();
        LocationWatcher.watch.then(null, null, (coords) => {
            $scope.coords = coords;
            if($scope.authData.attemptAutoLogin) {
                Auth.autoLogin();
            }
        });


        AuthData.observer.then(null, null, val => {
            $scope.authData = val;
            if(val.attemptAutoLogin) {
                Auth.autoLogin();
            }
        });
    }
);