angular.module('retro').service('BattleFlow', (Player, Battle, Toaster, $state, $ionicHistory, socket) => {

    const start = (monster) => {
        socket.emit('combat:enter', { name: Player.get().name, monsters: [monster] }, Toaster.handleDefault());
    };

    return {
        start
    };
});