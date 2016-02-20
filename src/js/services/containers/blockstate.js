angular.module('retro').service('BlockState', () => {

    let state = {};

    return {
        block: (thing) => state[thing] = true,
        unblock: (thing) => state[thing] = false,
        unblockAll: () => state = {},
        get: () => state
    };
});