angular.module('retro').service('LocationWatcher', ($q) => {

    const defer = $q.defer();
    const ready = $q.defer();

    const error = () => {
        console.log('GPS turned off, or connection errored.');
    };

    let currentCoords = {};

    const watcher = {
        current: () => currentCoords,
        start: () => {
            navigator.geolocation.getCurrentPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
                ready.resolve(currentCoords);
            }, error, { timeout: 10000 });

            navigator.geolocation.watchPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
            }, error, { timeout: 10000 });
        },

        ready: ready.promise,
        watch: defer.promise
    };

    watcher.start();

    return watcher;

});