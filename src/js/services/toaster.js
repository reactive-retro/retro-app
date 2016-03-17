angular.module('retro').service('Toaster', ($cordovaToast) => {

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

        callback();
    };

    const swallowSuccess = (callback = () => {}) => (err) => {
        if(err && err.msg) {
            show(err.msg);
        }

        callback();
    };

    return {
        show,
        swallow,
        swallowSuccess,
        handleDefault
    };
});