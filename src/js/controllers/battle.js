angular.module('retro').controller('BattleController',
    ($scope, $ionicModal, BattleFlow, Battle, Dice, Player, Skills, Options) => {
        $scope.battleFlow = BattleFlow;
        $scope.currentPlayerName = Player.get().name;
        $scope.targets = {};
        $scope.multiplier = 1;

        $scope.modals = {
            targetModal: null,
            resultsModal: null
        };

        $scope.me = null;

        const resultHandler = ({ battle, actions, isDone }) => {
            Battle.set(battle);
            $scope.disableActions = false;
            $scope.targets = {};
            $scope.results = actions;
            $scope.isDone = isDone;
            $scope.modals.resultsModal.show();
            if(isDone) {
                Battle.set(null);
            }
        };

        const setupBattleData = () => {
            $scope.battle = Battle.get();
            if(!$scope.battle) return;
            $scope.battle.actionChannel.watch($scope.setTarget);

            $scope.battle.resultsChannel.watch(resultHandler);

            // self shows up last
            $scope.orderedPlayers = _($scope.battle.players)
                .sortBy((player) => {
                    return player === $scope.currentPlayerName ? '~' : player;
                }).map(playerName => {
                    return _.find($scope.battle.playerData, { name: playerName });
                })
                .value();

            $scope.me = _.find($scope.battle.playerData, { name: $scope.currentPlayerName });

            $scope.uniqueSkills = _($scope.me.skills)
                .reject(skill => skill === 'Attack')
                .compact()
                .uniq()
                .map(skill => _.find(Skills.get(), { spellName: skill }))
                .value();
        };

        $scope.openSkillInfo = (skill) => {
            $scope.activeSkill = _.find(Skills.get(), { spellName: skill });

            $ionicModal.fromTemplateUrl('choosetarget.info', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modals.targetModal = modal;
                $scope.modals.targetModal.show();
            });
        };

        $scope.closeModal = (modal) => {
            $scope.modals[modal].hide();
            if($scope.isDone) {
                BattleFlow.toExplore();
            }
        };

        $scope.prepareTarget = (target) => {
            target.origin = $scope.currentPlayerName;
            $scope.setTarget(target);
            $scope.battle.actionChannel.publish(target);
            $scope.canConfirm = true;
            $scope.closeModal('targetModal');

            const options = Options.get();
            if(options.autoConfirmAttacks) {
                $scope.confirmAction();
            }
        };

        $scope.setTarget = (target) => {
            $scope.targets[target.origin] = target;
        };

        $scope.confirmAction = () => {
            $scope.canConfirm = false;
            $scope.disableActions = true;
            BattleFlow.confirmAction($scope.targets[$scope.currentPlayerName]);
        };

        $ionicModal.fromTemplateUrl('results.info', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then((modal) => {
            $scope.modals.resultsModal = modal;
        });

        // clean up modal b/c memory
        $scope.$on('$destroy', () => {
            $scope.modals.targetModal.remove();
            $scope.modals.resultsModal.remove();
        });

        setupBattleData();
        Battle.observer().then(null, null, setupBattleData);
    }
);