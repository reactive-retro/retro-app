angular.module('retro').controller('HomeController',
    ($scope, $http, $state, $ionicHistory, Auth) => {
        $scope.skipAuth = () => {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('player');
        };

        $scope.auth = Auth;

        $scope.tryAuth = () => {
            $state.go('create');
        };
    }
);