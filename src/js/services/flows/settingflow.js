angular.module('retro').service('SettingFlow', (BlockState, Player, Toaster, socket) => {
    return {
        change: ({ setting, newVal }) => {
            const newSettings = { name: Player.get().name, settingHash: { [setting]: newVal } };
            BlockState.block('Setting');
            socket.emit('player:change:setting', newSettings, Toaster.handleDefault(() => {
                BlockState.unblock('Setting');
            }));
        },
        changeMany: (settings) => {
            const newSettings = { name: Player.get().name, settingHash: settings };
            BlockState.block('Setting');
            socket.emit('player:change:setting', newSettings, Toaster.handleDefault(() => {
                BlockState.unblock('Setting');
            }));
        }
    };
});