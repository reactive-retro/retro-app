angular.module('retro').controller('BattleController',
    ($scope, $ionicModal, $timeout, BattleFlow, Battle, Dice, Player, Skills, MapDrawing, Options) => {
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

            $ionicModal.fromTemplateUrl('results.info', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modals.resultsModal = modal;
                $scope.modals.resultsModal.show();
            });

            if(isDone && !battle.isFled) {
                _.each(battle.monsters, monster => MapDrawing.hideMonster(monster.id));
                Battle.set(null);
            }
        };

        const battleSetter = ({ battle }) => {
            Battle.set(battle);
        };

        const setupBattleData = () => {
            $scope.battle = Battle.get();
            if(!$scope.battle) return;
            $scope.battle.actionChannel.watch((target) => $timeout($scope.setTarget(target)));

            $scope.battle.resultsChannel.watch(resultHandler);
            $scope.battle.updatesChannel.watch(battleSetter);

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

            $scope.hasItems = _($scope.me.itemUses).values().reduce((prev, cur) => prev + cur, 0);
        };

        $scope.openSkillInfo = (skill) => {
            $scope.activeSkill = _.find(Skills.get(), { spellName: skill });

            $ionicModal.fromTemplateUrl('choosetarget.skill', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modals.targetModal = modal;
                $scope.modals.targetModal.show();
            });
        };

        $scope.openItemInfo = (item) => {
            $scope.activeItem = _.find(Player.get().inventory, { name: item });

            $ionicModal.fromTemplateUrl('choosetarget.item', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modals.targetModal = modal;
                $scope.modals.targetModal.show();
            });
        };

        $scope.closeModal = (modal) => {
            $scope.modals[modal].hide();
        };

        $scope.prepareTarget = (target) => {
            target.origin = $scope.currentPlayerName;
            $scope.setTarget(target);
            $scope.battle.actionChannel.publish(target);
            $scope.canConfirm = true;
            $scope.closeModal('targetModal');

            const options = Options.get();
            if(options.autoConfirmAttacks) {
                if(options.autoConfirmAttacksIfOnly && _.filter($scope.battle.playerData, p => p.stats.hp.__current !== 0).length === 1) {
                    $scope.confirmAction();
                } else {
                    $scope.confirmAction();
                }
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

        $scope.$on('modal.hidden', () => {
            if($scope.isDone || !Battle.get()) {
                BattleFlow.toExplore();
            }
        });

        // clean up modal b/c memory
        $scope.$on('$destroy', () => {
            if($scope.modals.targetModal) $scope.modals.targetModal.remove();
            if($scope.modals.resultsModal) $scope.modals.resultsModal.remove();
        });

        setupBattleData();
        Battle.observer().then(null, null, setupBattleData);
    }
);