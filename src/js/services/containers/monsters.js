angular.module('retro').service('Monsters', ($q, Player) => {

    const defer = $q.defer();

    let shopToken = Player.get().shopToken;
    let monsters = [];
    let dungeonMonsters = [];

    const allMonsters = () => monsters.concat(dungeonMonsters);

    const updateMonsters = (newMonsters) => {
        monsters = newMonsters;
        defer.notify(allMonsters());
    };

    const updateDungeonMonsters = (newMonsters) => {
        const checkToken = Player.get().shopToken;
        if(checkToken !== shopToken) {
            shopToken = checkToken;
            dungeonMonsters = [];
        }

        dungeonMonsters.push(...newMonsters);

        // monkey-patch the array so it doesn't take forever to load
        const allFoundMonsters = allMonsters();
        allFoundMonsters.patch = newMonsters;
        defer.notify(allFoundMonsters);
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(monsters);
        },
        set: updateMonsters,
        push: updateDungeonMonsters,
        get: allMonsters
    };
});