angular.module('retro').service('Monsters', ($q) => {

    const defer = $q.defer();

    let monsters = [];

    const updateMonsters = (newMonsters) => {
        monsters = newMonsters;
        defer.notify(monsters);
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(monsters);
        },
        set: updateMonsters,
        get: () => monsters
    };
});