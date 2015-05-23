angular.module('retro').controller('HomeController',
    ($scope, $http, $state, Auth) => {
        $scope.auth = Auth;
    }
);