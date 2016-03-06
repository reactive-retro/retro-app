angular.module('retro').service('PartyFlow', (Player, Battle, Toaster, BlockState, $stateWrapper, socket) => {

    const create = () => {
        BlockState.block('Party');
        socket.emit('party:create', { name: Player.get().name }, Toaster.handleDefault(() => {
            BlockState.unblock('Party');
        }));
    };

    const leave = () => {
        socket.emit('party:leave', { name: Player.get().name }, Toaster.handleDefault());
    };

    const join = (partyId) => {
        BlockState.block('Party');
        socket.emit('party:join', { name: Player.get().name, partyId }, Toaster.handleDefault(() => {
            BlockState.unblock('Party');
        }));
    };

    return {
        create,
        leave,
        join
    };
});