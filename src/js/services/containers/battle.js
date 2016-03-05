angular.module('retro').service('Battle', ($q, $stateWrapper, Player) => {

    let defer = $q.defer();

    let battle = '';
    let socketRef = null;

    const update = (newBattle) => {

        if(battle) {
            battle.actionChannel.unsubscribe();
            battle.actionChannel.unwatch();
            battle.resultsChannel.unsubscribe();
            battle.resultsChannel.unwatch();
            battle.updatesChannel.unsubscribe();
            battle.updatesChannel.unwatch();
            socketRef.unsubscribe(`battle:${battle._id}:actions`);
            socketRef.unsubscribe(`battle:${battle._id}:results`);
            socketRef.unsubscribe(`battle:${battle._id}:updates`);

            if(!newBattle) {
                battle.actionChannel.destroy();
                battle.resultsChannel.destroy();
                battle.updatesChannel.destroy();

                // when the battle is over, reset the defer
                defer.resolve();
                defer = $q.defer();
            }
        }


        battle = newBattle;

        if(newBattle) {
            const myName = Player.get().name;
            const me = _.find(battle.playerData, { name: myName });
            Player.set(me);

            $stateWrapper.noGoingBack('battle');
            battle.actionChannel = socketRef.subscribe(`battle:${battle._id}:actions`);
            battle.resultsChannel = socketRef.subscribe(`battle:${battle._id}:results`);
            battle.updatesChannel = socketRef.subscribe(`battle:${battle._id}:updates`);
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