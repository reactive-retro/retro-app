angular.module('retro').service('EquipFlow', (Toaster, $stateWrapper, Player, socket) => {
    return {
        equip: (newItem) => {

            const player = Player.get();

            const opts = { name: player.name, itemId: newItem.itemId };
            socket.emit('player:change:equipment', opts, Toaster.handleDefault(() => $stateWrapper.go('player')));
        }
    };
});