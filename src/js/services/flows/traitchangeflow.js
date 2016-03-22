angular.module('retro').service('TraitChangeFlow', (Toaster, $state, Player, BlockState, socket) => {
    return {
        change: (trait, slot) => {

            const player = Player.get();

            const opts = { name: player.name, traitName: trait, traitSlot: slot };

            BlockState.block('Player');
            socket.emit('player:change:trait', opts, Toaster.swallowSuccess(() => {
                BlockState.unblock('Player');
            }));
        }
    };
});