angular.module('retro').controller('PlayerController',
    ($scope, $stateWrapper, Player) => {
        $scope.player = Player.get();
        $scope.isEmpty = _.isEmpty;

        $scope.go = (state) => () => $stateWrapper.goBreakCache(state);
        Player.observer.then(null, null, (player) => $scope.player = player);
    }
);