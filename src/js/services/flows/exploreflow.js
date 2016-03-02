angular.module('retro').service('ExploreFlow', (Player, LocationWatcher, Toaster, socket) => {

    const moveHomepoint = (homepoint) => {
        socket.emit('player:change:homepoint', { name: Player.get().name, homepoint }, Toaster.handleDefault());
    };

    return {
        moveHomepoint
    };
});