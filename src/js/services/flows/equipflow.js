angular.module('retro').service('EquipFlow', (Toaster, $stateWrapper, Player, BlockState, socket) => {
    return {
        equip: (newItem) => {

            const player = Player.get();

            const opts = { name: player.name, itemId: newItem.itemId };

            BlockState.block('Player');
            socket.emit('player:change:equipment', opts, Toaster.handleDefault(() => {
                $stateWrapper.go('player');
                BlockState.unblock('Player');
            }));
        },

        sell: (item) => {
            const player = Player.get();

            const opts = { name: player.name, itemId: item.itemId };

            BlockState.block('Player');
            socket.emit('player:sell:equipment', opts, Toaster.handleDefault(() => {
                BlockState.unblock('Player');
            }));
        }
    };
});