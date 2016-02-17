angular.module('retro').service('AuthData', ($q) => {

    const defer = $q.defer();

    const value = {
        canConnect: false,
        attemptAutoLogin: true
    };

    const update = opts => {
        _.extend(value, opts);
        defer.notify(value);
    };

    return {
        observer: defer.promise,
        update,
        get: () => value
    };
});