angular.module('retro').controller('HomeController',
    ($scope, $http, $state, LocationWatcher, Auth) => {
        $scope.auth = Auth;
    }
);