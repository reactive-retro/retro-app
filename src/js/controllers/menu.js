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
            { icon: 'ion-person', name: 'Player', state: 'player' },
            { icon: 'ion-earth', name: 'Explore', state: 'explore', requiresLocation: true },
            { icon: 'ion-briefcase', name: 'Inventory', state: 'inventory.armor' },
            { icon: 'ion-university', name: 'Skills', state: 'changeskills' },
            { icon: 'ion-ios-people', name: 'Party', state: 'party' },
            { icon: 'ion-gear-b', name: 'Options', state: 'options' },
            { icon: 'ion-android-exit', name: 'Logout', call: logoutCheck }
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