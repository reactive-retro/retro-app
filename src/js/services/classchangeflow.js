angular.module('retro').service('ClassChangeFlow', (Toaster, $state, Player, socket) => {
    return {
        change: (newProfession) => {

            var player = Player.get();

            var opts = {name: player.name, newProfession: newProfession};
            socket.emit('classchange', opts, (err, success) => {
                var msgObj = err ? err : success;
                Toaster.show(msgObj.msg);

                if(success) {
                    Player.set(success.player);
                    $state.go('player');
                }
            });
        }
    };
});