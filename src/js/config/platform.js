angular.module('retro').run(($rootScope, $ionicPlatform) => {

    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        $rootScope.hideMenu = toState.name === 'home' || toState.name === 'create';
    });

    $ionicPlatform.ready(() => {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if(window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    });
});