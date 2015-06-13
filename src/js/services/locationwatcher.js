angular.module('retro').service('LocationWatcher', ($q) => {

    const posOptions = {timeout: 10000, enableHighAccuracy: false};

    var defer = $q.defer();

    var error = () => {
        console.log('GPS turned off, or connection errored.');
    };

    var currentCoords = {};

    var watcher = {
        current: () => currentCoords,
        start: () => {
            navigator.geolocation.getCurrentPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
            }, error, posOptions);

            navigator.geolocation.watchPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
            }, error, {timeout: 30000});
        },

        watch: defer.promise
    };

    watcher.start();

    return watcher;

});