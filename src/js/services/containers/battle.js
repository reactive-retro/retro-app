angular.module('retro').service('Battle', ($q, $ionicHistory, $state, Player) => {

    let defer = $q.defer();

    let battle = '';
    let socketRef = null;

    const update = (newBattle) => {

        if(battle) {
            battle.actionChannel.unsubscribe();
            battle.actionChannel.unwatch();
            battle.resultsChannel.unsubscribe();
            battle.resultsChannel.unwatch();
            socketRef.unsubscribe(`battle:${battle._id}:actions`);
            socketRef.unsubscribe(`battle:${battle._id}:results`);

            if(!newBattle) {
                battle.actionChannel.destroy();
                battle.resultsChannel.destroy();

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

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go('battle');
            battle.actionChannel = socketRef.subscribe(`battle:${battle._id}:actions`);
            battle.resultsChannel = socketRef.subscribe(`battle:${battle._id}:results`);
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