angular.module('retro').service('Toaster', ($cordovaToast) => {

    const show = (msg) => {
        try {
            $cordovaToast.showLongBottom(msg);
        } catch(e) {
            console.log(msg);
        }
    };

    const handleDefault = (callback = () => {}) => (err, success) => {
        var msgObj = err ? err : success;
        Toaster.show(msgObj.msg);

        callback();
    };

    return {
        show,
        handleDefault
    };
});