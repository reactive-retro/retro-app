angular.module('retro').service('ClassChangeFlow', (Toaster, $state, Player, socket) => {
    return {
        change: (newProfession) => {

            var player = Player.get();

            var opts = {name: player.name, newProfession: newProfession};
            socket.emit('player:change:class', opts, Toaster.handleDefault(() => $state.go('player')));
        }
    };
});