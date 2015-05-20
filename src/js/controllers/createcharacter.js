angular.module('retro').controller('CreateCharacterController',
    ($scope, NewHero, CLASSES, AuthFlow) => {
        $scope.NewHero = NewHero;
        $scope.baseProfessions = ['Cleric', 'Mage', 'Fighter'];
        $scope.CLASSES = CLASSES;

        $scope.create = () => {
            AuthFlow.login(NewHero);
        };
    }
);