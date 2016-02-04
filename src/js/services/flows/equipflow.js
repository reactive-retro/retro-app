angular.module('retro').service('EquipFlow', (Toaster, $state, Player, socket) => {
    return {
        equip: (newItem) => {

            var player = Player.get();

            var opts = {name: player.name, itemId: newItem.itemId};
            socket.emit('player:change:equipment', opts, Toaster.handleDefault(() => $state.go('player')));
        }
    };
});