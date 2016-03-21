angular.module('retro').service('Battle', ($q, $stateWrapper, Player, Skills) => {

    let defer = $q.defer();

    let battle = null;
    let socketRef = null;
    let channels = null;

    const update = (newBattle) => {

        if(battle && !newBattle) {
            defer.resolve(battle);

            channels.actions.destroy();
            channels.results.destroy();
            channels.updates.destroy();

            channels = null;

            // when the battle is over, reset the defer
            defer = $q.defer();
        }


        battle = newBattle;

        if(battle) {
            const myName = Player.get().name;
            const me = _.find(battle.playerData, { name: myName });
            Player.set(me);

            if(me.newSkills) {
                Skills.set(me.newSkills);
            }

            // new battle
            if(!channels) {
                channels =  {
                    actions: socketRef.subscribe(`battle:${battle._id}:actions`),
                    results: socketRef.subscribe(`battle:${battle._id}:results`),
                    updates: socketRef.subscribe(`battle:${battle._id}:updates`)
                };
            }

            battle.channels = channels;

            $stateWrapper.noGoingBack('battle');
        }

        defer.notify(battle);
    };

    return {
        observer: () => defer.promise,
        apply: () => {
            defer.notify(battle);
        },
        setSocket: (socket) => socketRef = socket,
        set: update,
        get: () => battle
    };
});