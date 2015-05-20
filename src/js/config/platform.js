angular.module('retro').run(($ionicPlatform) => {
    $ionicPlatform.ready(() => {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if(window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    });
});