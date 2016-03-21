angular.module('retro').controller('SelectItemTargetController',
    ($scope, BattleFlow, Battle, AttributeCalculator) => {
        $scope.battleFlow = BattleFlow;
        $scope.battle = Battle.get();
        $scope.targets = {};

        $scope.activeItemAttrs = AttributeCalculator.itemEffects($scope.activeItem);

        $scope.target = {
            monster: (monster) => $scope.prepareTarget({ name: monster.name, id: monster.id, skill: 'Item', itemName: $scope.activeItem.name }),
            player: (player) => $scope.prepareTarget({ name: player.name, id: player.name, skill: 'Item', itemName: $scope.activeItem.name }),
            other: (other) => $scope.prepareTarget({ name: other, id: other, skill: 'Item', itemName: $scope.activeItem.name })
        };
    }
);