angular.module('retro').service('EquipFlow', (Toaster, Player, BlockState, socket) => {
    return {
        equip: (newItem) => {

            const player = Player.get();

            const opts = { name: player.name, itemId: newItem.itemId };

            BlockState.block('Player');
            socket.emit('player:change:equipment', opts, Toaster.handleDefault(() => {
                BlockState.unblock('Player');
            }));
        },

        sell: (item, quantity = 1) => {
            const player = Player.get();

            const opts = { name: player.name, itemId: item.itemId, itemQuantity: quantity };

            BlockState.block('Player');
            socket.emit('player:sell:equipment', opts, Toaster.handleDefault(() => {
                BlockState.unblock('Player');
            }));
        }
    };
});