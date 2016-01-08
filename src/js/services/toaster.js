angular.module('retro').service('Toaster', ($cordovaToast) => {
    return {
        show: (msg) => $cordovaToast.showLongBottom(msg)
    };
});