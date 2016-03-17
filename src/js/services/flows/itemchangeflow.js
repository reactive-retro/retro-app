angular.module('retro').service('ItemChangeFlow', (Toaster, $state, Player, BlockState, socket) => {
    return {
        change: (item, slot) => {

            const player = Player.get();

            const opts = { name: player.name, itemId: item ? item.itemId : null, itemSlot: slot };

            BlockState.block('Player');
            socket.emit('player:change:item', opts, Toaster.swallowSuccess(() => {
                BlockState.unblock('Player');
            }));
        }
    };
});