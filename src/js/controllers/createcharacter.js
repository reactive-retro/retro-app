angular.module('retro').controller('CreateCharacterController',
    ($scope, NewHero, CLASSES, AuthFlow) => {
        $scope.NewHero = NewHero;
        $scope.CLASSES = CLASSES;
        $scope.baseProfessions = ['Cleric', 'Mage', 'Fighter'];

        $scope.create = () => {
            AuthFlow.login(NewHero);
        };
    }
);