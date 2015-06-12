angular.module('retro').service('LocationWatcher', ($q) => {

    const posOptions = {timeout: 30000, enableHighAccuracy: true};

    var defer = $q.defer();

    var error = () => {
        alert('Could not load GPS. Please check your settings.');
    };

    var currentCoords = {};

    var watcher = {
        current: () => currentCoords,
        center: () => {
            navigator.geolocation.getCurrentPosition((position) => {
                currentCoords = position.coords;
                defer.notify(position.coords);
            }, error, posOptions)
        },

        watcher: () => {
            navigator.geolocation.watchPosition((position) => {
                currentCoords = position.coords;
                defer.notify(position.coords);
            }, error);
        },

        watch: defer.promise
    };

    watcher.center();

    return watcher;

});