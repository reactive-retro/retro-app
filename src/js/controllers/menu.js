angular.module('retro').controller('MenuController',
    ($scope, $state) => {
        $scope.menu = [
            { icon: 'ion-person', name: 'Player', state: 'player' },
            { icon: 'ion-earth', name: 'Explore', state: 'explore' },
            { icon: 'ion-briefcase', name: 'Inventory', state: 'inventory' },
            { icon: 'ion-gear-b', name: 'Options', state: 'options' }
        ];

        $scope.travel = (state) => {
            $state.go(state);
        };

        $scope.$root.$on('$stateChangeSuccess', (event, toState) => {
            $scope.$root.hideMenu = toState.name === 'home' || toState.name === 'create';
        });
    }
);