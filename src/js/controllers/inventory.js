angular.module('retro').controller('InventoryController',
    ($scope, Player, EquipFlow) => {
        $scope.player = Player.get();
        Player.observer.then(null, null, (player) => $scope.player = player);
        $scope.isEmpty = _.isEmpty;

        $scope.EquipFlow = EquipFlow;
    }
);