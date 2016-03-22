angular.module('retro').service('Traits', ($q) => {

    const defer = $q.defer();

    let traits = [];

    const getNewTraits = (newTraits) => {
        traits = newTraits;
        defer.notify(traits);
    };

    return {
        observer: defer.promise,
        set: getNewTraits,
        get: () => traits
    };
});