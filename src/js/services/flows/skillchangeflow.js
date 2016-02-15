angular.module('retro').service('SkillChangeFlow', (Toaster, $state, Player, socket) => {
    return {
        change: (skill, slot) => {

            const player = Player.get();

            const opts = { name: player.name, skillName: skill, skillSlot: slot };
            socket.emit('player:change:skill', opts, Toaster.handleDefault());
        }
    };
});