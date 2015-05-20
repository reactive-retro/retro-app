angular.module('retro').controller('ClassChangeController',
    ($scope, Player, CLASSES) => {
        $scope.player = Player;
        $scope.CLASSES = CLASSES;
    }
);