angular.module('retro').controller('BattleController',
    ($scope, BattleFlow) => {
        $scope.battleFlow = BattleFlow;
    }
);