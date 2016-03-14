angular.module('retro').controller('ClassChangeController',
    ($scope, Player, Settings, ClassChangeFlow) => {
        $scope.player = Player.get();
        $scope.CLASSES = Settings.CLASS_DESCRIPTIONS;
        $scope.ClassChangeFlow = ClassChangeFlow;

        Player.observer.then(null, null, (player) => $scope.player = player);
    }
);