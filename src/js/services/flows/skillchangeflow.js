angular.module('retro').service('SkillChangeFlow', (Toaster, $state, Player, BlockState, socket) => {
    return {
        change: (skill, slot) => {

            const player = Player.get();

            const opts = { name: player.name, skillName: skill, skillSlot: slot };

            BlockState.block('Player');
            socket.emit('player:change:skill', opts, Toaster.handleDefault(() => {
                BlockState.unblock('Player');
            }));
        }
    };
});