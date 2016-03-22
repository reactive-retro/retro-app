angular.module('retro').service('Toaster', ($cordovaToast, $timeout) => {

    const show = (msg) => {
        try {
            $cordovaToast.showLongBottom(msg);
        } catch(e) {
            console.log(msg);
        }
    };

    const swallow = (callback = () => {}) => callback();

    const handleDefault = (callback = () => {}) => (err, success) => {
        const msgObj = err ? err : success;
        show(msgObj.msg);

        $timeout(callback);
    };

    const swallowSuccess = (callback = () => {}) => (err) => {
        if(err && err.msg) {
            show(err.msg);
        }

        $timeout(callback);
    };

    return {
        show,
        swallow,
        swallowSuccess,
        handleDefault
    };
});