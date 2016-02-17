angular.module('retro').service('BattleFlow', (Player, Battle, Toaster, $stateWrapper, socket) => {

    const start = (monster) => {
        socket.emit('combat:enter', { name: Player.get().name, monsters: [monster] }, Toaster.handleDefault());
    };

    const confirmAction = ({ origin, id, skill }) => {
        socket.emit('combat:confirmaction', { skill, target: id, name: origin }, Toaster.handleDefault());
    };

    const toExplore = () => {
        $stateWrapper.noGoingBack('explore');
    };

    return {
        start,
        confirmAction,
        toExplore
    };
});