angular.module('retro').service('ClassChangeFlow', (Toaster, $stateWrapper, Player, socket) => {
    return {
        change: (newProfession) => {

            const player = Player.get();

            const opts = { name: player.name, newProfession: newProfession };
            socket.emit('player:change:class', opts, Toaster.handleDefault(() => $stateWrapper.go('player')));
        }
    };
});