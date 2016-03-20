angular.module('retro').service('$stateWrapper', ($state, $ionicHistory) => {
    return {
        go: (state, data) => {
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            $state.go(state, data);
        },
        noGoingBackAndNoCache: (state) => {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go(state, { timestamp: Date.now() });
        },
        goBreakCache: (state) => {
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
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