angular.module('retro').controller('SkillChangeController',
    ($scope, $ionicModal, Player, Skills, SkillChangeFlow, Dice) => {
        $scope.player = Player.get();

        const getAllSkills = (baseSkills) => _(baseSkills)
            .each(skill => skill.spellLevel = skill.spellClasses[_.keys(skill.spellClasses)[0]])
            .sortBy([
                'spellLevel',
                'spellName'
            ])
            .groupBy(skill => {
                return _.keys(skill.spellClasses)[0];
            })
            .value();

        $scope.allSkills = getAllSkills(Skills.get());

        $scope.openSkillInfo = (skill) => {
            $scope.activeSkill = skill;
            $scope.activeSkillAttrs = _(skill.spellEffects)
                .keys()
                .map(key => {
                    const stats = Dice.statistics(skill.spellEffects[key].roll, $scope.player.stats);
                    return { name: key, value: stats, extra: skill.spellEffects[key] };
                })
                // Damage always comes first
                .sortBy((obj) => obj.name === 'Damage' ? '*' : obj.name)
                .value();

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

        Player.observer.then(null, null, (player) => $scope.player = player);
        Skills.observer.then(null, null, (skills) => $scope.allSkills = getAllSkills(skills));
    }
);