angular.module('retro').controller('SkillChangeModalController',
    ($scope, Player, Skills, SkillChangeFlow, AttributeCalculator) => {

        $scope.activeSkillAttrs = AttributeCalculator.skillEffects($scope.activeSkill, false);

        $scope.setSkillInSlot = (skill, slot) => {
            // unset skill
            if($scope.player.skills[slot] === skill) {
                SkillChangeFlow.change(null, slot);
                return;
            }

            // set skill
            SkillChangeFlow.change(skill, slot);
        };

        $scope.closeSkillInfo = () => {
            $scope.modal.hide();
            $scope.modal.remove();
        };
    }
);