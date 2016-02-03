angular.module('retro').controller('SkillChangeController',
    ($scope, $ionicModal, Player, SkillChangeFlow) => {
        $scope.player = Player.get();

        $scope.getAllSkills = () => _($scope.player.possibleSkills)
            .each(skill => skill.spellLevel = skill.spellClasses[_.keys(skill.spellClasses)[0]])
            .sortBy([
                'spellLevel',
                'spellName'
            ])
            .groupBy(skill => {
                return _.keys(skill.spellClasses)[0];
            })
            .value();

        $scope.allSkills = $scope.getAllSkills();

        $scope.openSkillInfo = (skill) => {
            $scope.activeSkill = skill;
            $scope.modal.show();
        };

        $scope.countNumTimesSkillSet = (skillName) => _.filter($scope.player.skills, skill => skill === skillName).length;

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

        $ionicModal.fromTemplateUrl('changeskill.info', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // clean up modal b/c memory
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        Player.observer.then(null, null, (player) => {
            $scope.player = player;
            $scope.allSkills = $scope.getAllSkills();
        });
    }
);