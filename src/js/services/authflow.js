angular.module('retro').service('AuthFlow', ($state, socket) => {
    return {
        tryAuth: () => {
            $state.go('create');
        },
        login: (NewHero) => {
            socket.emit('login', NewHero);
        }
    };
});