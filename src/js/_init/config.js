angular.module('retro').constant('Config', {
    _cfg: 'DEV',
    DEV: {
        url: '127.0.0.1',
        port: 8080
    },
    PROD: {
        protocol: 'https',
        url: 'reactive-retro.herokuapp.com',
        port: 80
    }
});