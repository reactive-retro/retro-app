angular.module('retro').service('Battle', ($q, $ionicHistory, $state) => {

    const defer = $q.defer();

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
        }

        battle = newBattle;

        if(battle) {
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
        observer: defer.promise,
        apply: () => {
            defer.notify(battle);
        },
        setSocket: (socket) => socketRef = socket,
        set: update,
        get: () => battle
    };
});