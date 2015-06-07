angular.module('retro').controller('CreateCharacterController',
    ($scope, NewHero, CLASSES, AuthFlow, $localStorage) => {
        $scope.NewHero = NewHero;
        $scope.CLASSES = CLASSES;
        $scope.baseProfessions = ['Cleric', 'Mage', 'Fighter'];

        $scope.create = () => {
            var hero = _.merge(NewHero, $localStorage);
            AuthFlow.login(hero);
        };
    }
);