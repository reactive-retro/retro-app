angular.module('retro').service('ItemContainerFlow', ($state, BlockState, Player, Toaster, socket) => {

    const getNotYetActivatedItems = (place) => {
        const player = Player.get();
        if(!player.actionsTaken) return place.contents;
        if(!player.actionsTaken.shop) return place.contents;
        if(!player.actionsTaken.shop[place.seed]) return place.contents;

        return _.filter(place.contents, item => !_.contains(player.actionsTaken.shop[place.seed], item.itemId));
    };

    const getStateFromType = (type) => {
        if(_.contains(type, 'Store')) return 'shop';
        return 'chest';
    };

    const fixContents = (shop) => {
        _.each(shop.contents, item => {
            delete item.$$hashKey;
            _.each(item.effects, effect => delete effect.$$hashKey);
        });
        return shop;
    };

    return {

        getNotYetActivatedItems,

        canEnter: (data) => {
            const requirements = data.requirements;
            const killed = Player.get().actionsTaken.dungeonMonster;
            const intersectionLength = _.intersection(killed, requirements).length;

            if(intersectionLength !== requirements.length) return requirements.length - intersectionLength;
            return 0;
        },

        enter: (data) => {
            $state.go(getStateFromType(data.derivedType), { containerData: data });
        },

        buyItem: (shop, itemId, callback) => {
            BlockState.block('Shop');
            socket.emit('shop:buy', { name: Player.get().name, place: fixContents(shop), itemId }, Toaster.handleDefault(() => {
                BlockState.unblock('Shop');
                callback(getNotYetActivatedItems(shop));
            }));
        },

        takeItem: (shop, itemId, callback) => {
            BlockState.block('Shop');
            socket.emit('shop:take', { name: Player.get().name, place: fixContents(shop), itemId }, Toaster.handleDefault(() => {
                BlockState.unblock('Shop');
                callback(getNotYetActivatedItems(shop));
            }));
        }
    };
});