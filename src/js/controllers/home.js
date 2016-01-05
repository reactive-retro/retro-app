angular.module('retro').controller('HomeController',
    ($scope, LocationWatcher, Auth) => {
        $scope.auth = Auth;
    }
);