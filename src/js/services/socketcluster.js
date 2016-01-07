angular.module('retro')
    .service('socketCluster', ($window) => $window.socketCluster)
    .service('socket', (Config, socketCluster) => socketCluster.connect({protocol: Config[Config._cfg].protocol, hostname: Config[Config._cfg].url, port: Config[Config._cfg].port}));