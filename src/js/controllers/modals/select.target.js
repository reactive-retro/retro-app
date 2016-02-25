angular.module('retro').controller('SelectTargetController',
    ($scope, BattleFlow, Battle, Dice) => {
        $scope.battleFlow = BattleFlow;
        $scope.battle = Battle.get();
        $scope.targets = {};

        $scope.multiplier = BattleFlow.getMultiplier($scope.activeSkill.spellName, $scope.me);

        const skillRef = $scope.activeSkill;
        if(skillRef.spellName === 'Attack') {
            $scope.multiplier += 1;
        }

        $scope.activeSkillAttrs = _(skillRef.spellEffects)
            .keys()
            .map(key => {
                const stats = Dice.statistics(skillRef.spellEffects[key].roll, $scope.me.stats, 1);
                return { name: key, value: stats, extra: skillRef.spellEffects[key], accuracy: $scope.me.stats.acc };
            })
            // Damage always comes first
            .sortBy((obj) => obj.name === 'Damage' ? '*' : obj.name)
            .value();

        $scope.target = {
            monster: (monster) => $scope.prepareTarget({ name: monster.name, id: monster.id, skill: $scope.activeSkill.spellName }),
            player: (player) => $scope.prepareTarget({ name: player.name, id: player.name, skill: $scope.activeSkill.spellName }),
            other: (other) => $scope.prepareTarget({ name: other, id: other, skill: $scope.activeSkill.spellName })
        };

        $scope.closeModal = () => {
            $scope.modals.targetModal.hide();
        };

        $scope.setTarget = (target) => {
            $scope.targets[target.origin] = target;
        };
    }
);