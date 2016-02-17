angular.module('retro').controller('MenuController',
    ($scope, $state, $stateWrapper, $ionicPopup, Auth) => {

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
            { icon: 'ion-earth', name: 'Explore', state: 'explore' },
            { icon: 'ion-briefcase', name: 'Inventory', state: 'inventory' },
            { icon: 'ion-university', name: 'Skills', state: 'changeskills' },
            { icon: 'ion-gear-b', name: 'Options', state: 'options' },
            { icon: 'ion-android-exit', name: 'Logout', call: logoutCheck }
        ];

        $scope.travel = $stateWrapper.noGoingBackAndNoCache;
    }
);