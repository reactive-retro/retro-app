angular.module('retro').service('Player', ($q, Skills) => {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    const defer = $q.defer();

    let player = {};

    let oldProfession = '';

    const updatePlayer = (newPlayer) => {
        player = newPlayer;
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