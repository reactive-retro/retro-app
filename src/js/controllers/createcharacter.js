angular.module('retro').controller('CreateCharacterController',
    ($scope, NewHero, CLASSES, AuthFlow, LocationWatcher, $localStorage) => {
        $scope.NewHero = NewHero;
        $scope.CLASSES = CLASSES;
        $scope.baseProfessions = ['Thief', 'Mage', 'Fighter'];

        $scope.create = () => {
            if(!$scope.coords) return;
            const hero = _.merge(NewHero, $localStorage);
            hero.homepoint = { lat: $scope.coords.latitude, lon: $scope.coords.longitude };
            AuthFlow.login(hero);
        };

        LocationWatcher.watch.then(null, null, coords => {
            $scope.coords = coords;
        });
    }
);