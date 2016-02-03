angular.module('retro').service('Player', ($q, socket) => {
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

    const getNewSkills = (player) => {
        socket.emit('getskills', { name: player.name }, (err, res) => {
            if(!res || !res.skills) {
                player.possibleSkills = [];
                return;
            }
            player.possibleSkills = res.skills;
            updatePlayer(player);
        });
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(player);
        },
        set: (newPlayer) => {
            if(oldProfession !== newPlayer.profession) {
                oldProfession = newPlayer.profession;
                getNewSkills(newPlayer);
                return;
            }

            updatePlayer(newPlayer);
        },
        get: () => player
    };
});