angular.module('retro').service('Player', ($q) => {
    const defer = $q.defer();

    let player = {};

    const updatePlayer = (newPlayer) => {
        player = newPlayer;
        defer.notify(player);
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(player);
        },
        set: updatePlayer,
        get: () => player
    };
});