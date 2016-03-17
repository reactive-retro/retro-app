angular.module('retro').controller('SelectSkillTargetController',
    ($scope, BattleFlow, Battle, AttributeCalculator) => {
        $scope.battleFlow = BattleFlow;
        $scope.battle = Battle.get();
        $scope.targets = {};

        $scope.multiplier = BattleFlow.getMultiplier($scope.activeSkill.spellName, $scope.me);

        const skillRef = $scope.activeSkill;
        if(skillRef.spellName === 'Attack') {
            $scope.multiplier += 1;
        }

        $scope.activeSkillAttrs = AttributeCalculator.skillEffects(skillRef, true);

        $scope.target = {
            monster: (monster) => $scope.prepareTarget({ name: monster.name, id: monster.id, skill: $scope.activeSkill.spellName }),
            player: (player) => $scope.prepareTarget({ name: player.name, id: player.name, skill: $scope.activeSkill.spellName }),
            other: (other) => $scope.prepareTarget({ name: other, id: other, skill: $scope.activeSkill.spellName })
        };

        $scope.closeModal = () => {
            $scope.modals.targetModal.hide();
        };
    }
);