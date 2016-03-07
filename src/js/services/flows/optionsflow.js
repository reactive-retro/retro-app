angular.module('retro').service('OptionsFlow', (BlockState, Player, Toaster, socket) => {
    return {
        changeMany: (options) => {
            const newOptions = { name: Player.get().name, optionsHash: options };
            BlockState.block('Options');
            socket.emit('player:change:options', newOptions, Toaster.swallow(() => {
                BlockState.unblock('Options');
            }));
        }
    };
});