angular.module('retro').controller('SkillChangeModalController',
    ($scope, Player, Skills, SkillChangeFlow, Dice) => {

        const skill = $scope.activeSkill;

        $scope.activeSkillAttrs = _(skill.spellEffects)
            .keys()
            .map(key => {
                const roll = skill.spellEffects[key].roll;
                const stats = roll ? Dice.statistics(roll, $scope.player.stats, 1) : null;
                return { name: key, value: stats, extra: skill.spellEffects[key] };
            })
            // Damage always comes first
            .sortBy((obj) => obj.name === 'Damage' ? '*' : obj.name)
            .value();

        $scope.setSkillInSlot = (skill, slot) => {
            // unset skill
            if($scope.player.skills[slot] === skill) {
                SkillChangeFlow.change(null, slot);
                return;
            }

            // set skill
            SkillChangeFlow.change(skill, slot);
        };

        $scope.closeSkillInfo = () => $scope.modal.hide();
    }
);