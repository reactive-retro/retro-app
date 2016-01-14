angular.module('retro').constant('Config', {
    _cfg: 'DEV',
    DEV: {
        url: '192.168.1.9',
        port: 8080
    },
    PROD: {
        protocol: 'https',
        url: 'reactive-retro.herokuapp.com',
        port: 80
    }
});