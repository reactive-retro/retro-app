angular.module('retro').service('$stateWrapper', ($state, $ionicHistory) => {
    return {
        go: $state.go,
        noGoingBackAndNoCache: (state) => {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go(state, { timestamp: Date.now() });
        },
        goBreakCache: (state) => {
            $state.go(state, { timestamp: Date.now() });
        },
        noGoingBack: (state) => {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go(state);
        }
    };
});