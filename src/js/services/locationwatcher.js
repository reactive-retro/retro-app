angular.module('retro').service('LocationWatcher', ($q) => {

    let defer = $q.defer();
    let ready = $q.defer();

    let error = () => {
        console.log('GPS turned off, or connection errored.');
    };

    let currentCoords = {};

    let watcher = {
        current: () => currentCoords,
        start: () => {
            navigator.geolocation.getCurrentPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
                ready.resolve(currentCoords);
            }, error, {timeout: 10000});

            navigator.geolocation.watchPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
            }, error, {timeout: 30000});
        },

        ready: ready.promise,
        watch: defer.promise
    };

    watcher.start();

    return watcher;

});