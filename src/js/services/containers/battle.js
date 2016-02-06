angular.module('retro').service('Battle', ($q, $ionicHistory, $state) => {

    const defer = $q.defer();

    let battle = '';

    const updateId = (newBattle) => {
        battle = newBattle;
        defer.notify(battle);

        if(battle) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go('battle');
        }
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(battle);
        },
        set: updateId,
        get: () => battle
    };
});