angular.module('retro').controller('BattleController',
    ($scope, BattleFlow, Battle, Player) => {
        $scope.battleFlow = BattleFlow;
        $scope.currentPlayerName = Player.get().name;

        const setupBattleData = () => {
            $scope.battle = Battle.get();

            const me = _.find($scope.battle.playerData, { name: $scope.currentPlayerName });
            $scope.uniqueSkills = _.uniq(me.skills);
        };

        setupBattleData();
        Battle.observer.then(null, null, setupBattleData);

        /*
        TODO make buffbar
            - ion-flash - paralyzed
            - ion-eye-disabled - blinded
            - ion-fireball - burned
            - ion-ios-snowy - frozen
            - ion-load-b - stunned
         */
    }
);