angular.module('retro').service('LocationWatcher', (socket, Player, $q) => {

    const defer = $q.defer();
    const ready = $q.defer();

    const error = () => {
        console.log('GPS turned off, or connection errored.');
    };

    const updateLocation = () => {
        Player.get().location = { lat: currentCoords.latitude, lon: currentCoords.longitude };
        socket.emit('player:change:location', { name: Player.get().name, coords: { latitude: currentCoords.latitude, longitude: currentCoords.longitude } });
    };

    let currentCoords = null;

    const watcher = {
        current: () => currentCoords,
        start: () => {
            navigator.geolocation.getCurrentPosition((position) => {
                currentCoords = position.coords;
                defer.notify(currentCoords);
                ready.resolve(currentCoords);
                updateLocation();
            }, error, { timeout: 10000 });

            navigator.geolocation.watchPosition((position) => {
                currentCoords = position.coords;
                updateLocation();
            }, error, { timeout: 10000 });
        },

        ready: ready.promise,
        watch: defer.promise
    };

    watcher.start();

    return watcher;

});