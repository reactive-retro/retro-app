angular.module('retro').service('Party', ($q) => {

    const defer = $q.defer();

    let party = '';
    let socketRef = null;

    const update = (newParty) => {

        if(party) {
            party.updateChannel.unsubscribe();
            party.updateChannel.unwatch();
            socketRef.unsubscribe(`party:${party._id}`);

            if(!newParty) {
                party.updateChannel.destroy();
            }
        }

        party = newParty;

        if(party) {
            party.updateChannel = socketRef.subscribe(`party:${party._id}`);
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