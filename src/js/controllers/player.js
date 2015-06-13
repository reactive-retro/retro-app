angular.module('retro').controller('PlayerController',
    ($scope, $state, Player) => {
        $scope.player = Player.get();
        Player.observer.then(null, null, (player) => $scope.player = player);
        $scope.isEmpty = _.isEmpty;

        $scope.go = (to) => {
            $state.go(to);
        };
    }
);