angular.module('retro').service('Player', ($q) => {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    var defer = $q.defer();

    var player = {};

    var functions = {
        calc: {
            stat: (stat) => _.reduce(player.equipment, (prev, item) => prev + (item.stats[stat] || 0), 0)
        }
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(player);
        },
        set: (newPlayer) => {
            player = newPlayer;
            _.merge(player, functions);
            defer.notify(player);
        },
        get: () => player
    };
});