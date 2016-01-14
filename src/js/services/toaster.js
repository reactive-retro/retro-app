angular.module('retro').service('Toaster', ($cordovaToast) => {
    return {
        show: (msg) => {
            try {
                $cordovaToast.showLongBottom(msg);
            } catch(e) {
                console.log(msg);
            }
        }
    };
});