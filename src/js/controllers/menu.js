angular.module('retro').controller('MenuController',
    ($scope, $state, $stateWrapper, $ionicPopup, Auth, LocationWatcher, Toaster) => {

        const logoutCheck = () => {
            $ionicPopup.confirm({
                title: 'Log out?',
                template: 'Are you sure you want to log out?'
            }).then(res => {
                if(!res) { return; }
                Auth.logout();
            });
        };

        $scope.stateHref = $state.href;

        $scope.menu = [
            { icon: 'game-icon-menu-player',    name: 'Player', state: 'player' },
            { icon: 'game-icon-menu-world',     name: 'Explore', state: 'explore', requiresLocation: true },
            { icon: 'game-icon-menu-inventory', name: 'Inventory', state: 'inventory.armor' },
            { icon: 'game-icon-menu-skills',    name: 'Skills', state: 'changeskills' },
            { icon: 'game-icon-menu-traits',    name: 'Traits', state: 'changetraits' },
            { icon: 'game-icon-menu-party',     name: 'Party', state: 'party' },
            { icon: 'game-icon-menu-options',   name: 'Options', state: 'options' },
            { icon: 'game-icon-menu-logout',    name: 'Logout', call: logoutCheck }
        ];

        $scope.doMenuAction = (menuObj) => {
            if(menuObj.call) return menuObj.call();
            if(menuObj.requiresLocation && (!$scope.coords || !$scope.coords.latitude || !$scope.coords.longitude)) return Toaster.show('Your GPS needs to be enabled to see this.');
            $stateWrapper.noGoingBackAndNoCache(menuObj.state);
        };

        $scope.coords = LocationWatcher.current();
        LocationWatcher.watch.then(null, null, (coords) => $scope.coords = coords);
    }
);