angular.module('retro').controller('CreateCharacterController',
    ($scope, NewHero, CLASSES, socket) => {
        $scope.NewHero = NewHero;
        $scope.baseProfessions = ['Cleric', 'Mage', 'Fighter'];
        $scope.CLASSES = CLASSES;

        $scope.create = () => {
            //console.log(socket.getState());
            socket.emit('login', NewHero);
        };
    }
);