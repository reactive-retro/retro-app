angular.module('retro').constant('Config', {
    _cfg: 'PROD',
    DEV: {
        url: '192.168.1.8',
        port: 8080
    },
    PROD: {
        protocol: 'https',
        url: 'reactive-retro.herokuapp.com',
        port: 80
    }
});