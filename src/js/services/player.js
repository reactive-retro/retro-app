angular.module('retro').service('Player', ($q, Skills) => {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    const defer = $q.defer();

    let player = {};

    const functions = {
        calc: {
            stat: (stat) => _.reduce(player.equipment, (prev, item) => prev + (item.stats[stat] || 0), 0)
        }
    };

    let oldProfession = '';

    const updatePlayer = (newPlayer) => {
        player = newPlayer;
        _.merge(player, functions);
        defer.notify(player);
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(player);
        },
        set: (newPlayer) => {
            updatePlayer(newPlayer);

            if(oldProfession !== newPlayer.profession) {
                Skills.update(newPlayer);
            }
        },
        get: () => player
    };
});