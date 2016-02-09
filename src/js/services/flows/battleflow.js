angular.module('retro').service('BattleFlow', (Player, Battle, Toaster, $state, $ionicHistory, socket) => {

    const start = (monster) => {
        socket.emit('combat:enter', { name: Player.get().name, monsters: [monster] }, Toaster.handleDefault());
    };

    const confirmAction = ({ origin, id, skill }, callback = () => {}) => {
        socket.emit('combat:confirmaction', { skill, target: id, name: origin }, Toaster.handleDefault(callback));
    };

    return {
        start,
        confirmAction
    };
});