angular.module('retro').service('Party', ($q, Battle) => {

    const defer = $q.defer();

    let party = '';
    let socketRef = null;

    const update = (newParty) => {

        if(party) {
            party.updateChannel.unsubscribe();
            party.updateChannel.unwatch();
            socketRef.unsubscribe(`party:${party._id}`);

            party.battleChannel.unsubscribe();
            party.battleChannel.unwatch();
            socketRef.unsubscribe(`party:${party._id}:battle`);

            if(!newParty) {
                party.updateChannel.destroy();
                party.battleChannel.destroy();
            }
        }

        party = newParty;

        if(party) {
            party.updateChannel = socketRef.subscribe(`party:${party._id}`);
            party.battleChannel = socketRef.subscribe(`party:${party._id}:battle`);
            party.battleChannel.watch(Battle.set);
        }

        defer.notify(party);
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(party);
        },
        setSocket: (socket) => socketRef = socket,
        set: update,
        get: () => party
    };
});