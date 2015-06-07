angular.module('retro').controller('ClassChangeController',
    ($scope, Player, CLASSES, ClassChangeFlow) => {
        $scope.player = Player.get();
        $scope.CLASSES = CLASSES;
        $scope.ClassChangeFlow = ClassChangeFlow;

        Player.observer.then(null, null, (player) => $scope.player = player);
    }
);