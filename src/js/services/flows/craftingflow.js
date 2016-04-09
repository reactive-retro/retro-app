angular.module('retro').service('CraftingFlow', ($stateWrapper, Toaster, Player, BlockState, socket) => {
    return {
        enter: (place) => {
            $stateWrapper.go('crafting', { place });
        },

        doMod: (place, item, material) => {
            const player = Player.get();
            const opts = { name: player.name, place, itemId: item.itemId, materialId: material.itemId };

            BlockState.block('Craft');
            socket.emit('player:craft:reinforce', opts, Toaster.handleDefault(() => {
                BlockState.unblock('Craft');
            }));
        }
    };
});