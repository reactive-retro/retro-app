angular.module('retro').service('EquipFlow', ($cordovaToast, $state, Player, socket) => {
    return {
        equip: (newItem) => {

            var player = Player.get();

            var opts = {name: player.name, itemId: newItem.itemId};
            socket.emit('equip', opts, (err, success) => {
                var msgObj = err ? err : success;
                $cordovaToast.showLongBottom(msgObj.msg);

                if(success) {
                    Player.set(success.player);
                    $state.go('player');
                }
            });
        }
    };
});