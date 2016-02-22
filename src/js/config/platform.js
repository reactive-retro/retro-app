angular.module('retro').run(($rootScope, $ionicPlatform, $ionicAnalytics) => {

    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        $rootScope.hideMenu = toState.name === 'home' || toState.name === 'create' || toState.name === 'battle';
    });

    $ionicPlatform.registerBackButtonAction(e => {
        e.preventDefault();
    }, 100);

    $ionicPlatform.ready(() => {
        $ionicAnalytics.register();

        if(window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if(window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    });
});