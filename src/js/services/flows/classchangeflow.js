angular.module('retro').service('ClassChangeFlow', (Toaster, $state, Player, socket) => {
    return {
        change: (newProfession) => {

            var player = Player.get();

            var opts = {name: player.name, newProfession: newProfession};
            socket.emit('player:change:class', opts, (err, success) => {
                var msgObj = err ? err : success;
                Toaster.show(msgObj.msg);

                if(success) {
                    $state.go('player');
                }
            });
        }
    };
});