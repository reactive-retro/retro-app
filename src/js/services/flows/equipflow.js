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
        }
    };
});