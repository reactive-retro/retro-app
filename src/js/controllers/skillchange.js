angular.module('retro').controller('SkillChangeController',
    ($scope, $ionicModal, Player, skills) => {
        $scope.player = Player.get();

        $scope.allSkills = _(skills)
            .each(skill => skill.spellLevel = skill.spellClasses[_.keys(skill.spellClasses)[0]])
            .sortBy([
                'spellLevel',
                'spellName'
            ])
            .groupBy(skill => {
                return _.keys(skill.spellClasses)[0];
            })
            .value();

        $scope.openSkillInfo = (skill) => {
            $scope.activeSkill = skill;
            $scope.modal.show();
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

        Player.observer.then(null, null, (player) => $scope.player = player);
    }
);