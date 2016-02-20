angular.module('retro').service('ClassChangeFlow', (Toaster, $stateWrapper, Player, BlockState, socket) => {
    return {
        change: (newProfession) => {

            const player = Player.get();

            const opts = { name: player.name, newProfession: newProfession };

            BlockState.block('Player');
            socket.emit('player:change:class', opts, Toaster.handleDefault(() => {
                $stateWrapper.go('player');
                BlockState.unblock('Player');
            }));
        }
    };
});