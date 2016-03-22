angular.module('retro').controller('SkillChangeController',
    ($scope, $ionicModal, Player, Skills, AttributeCalculator) => {
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
            .reduce((res, val, key) => {
                res.push({ prof: key, profSkills: val });
                return res;
            }, []);

        $scope.allSkills = getAllSkills(Skills.get());

        $scope.openSkillInfo = (skill) => {
            $scope.activeSkill = AttributeCalculator.modifySkill(skill);

            $ionicModal.fromTemplateUrl('changeskill.info', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.countNumTimesSkillSet = (skillName) => _.filter($scope.player.skills, skill => skill === skillName).length;

        Player.observer.then(null, null, (player) => $scope.player = player);
        Skills.observer.then(null, null, (skills) => $scope.allSkills = getAllSkills(skills));
    }
);