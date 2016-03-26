angular.module('retro').service('LocationWatcher', (socket, Player, $q) => {

    const defer = $q.defer();
    const ready = $q.defer();

    const error = () => {
        console.log('GPS turned off, or connection errored.');
    };

    const updateLocation = ({ coords }) => {
        currentCoords = coords;
        Player.get().location = { lat: currentCoords.latitude, lon: currentCoords.longitude };
        defer.notify(currentCoords);
        ready.resolve(currentCoords);
        socket.emit('player:change:location', { name: Player.get().name, coords: { latitude: currentCoords.latitude, longitude: currentCoords.longitude } });
    };

    let currentCoords = null;

    const watcher = {
        current: () => currentCoords,
        start: () => {
            navigator.geolocation.getCurrentPosition(updateLocation, error, { timeout: 10000 });
            navigator.geolocation.watchPosition(updateLocation, error, { timeout: 10000 });
        },

        ready: ready.promise,
        watch: defer.promise
    };

    watcher.start();

    return watcher;

});