angular.module('retro')
    .service('socketCluster', ($window) => $window.socketCluster)
    .service('socket', (DEV_CFG, socketCluster) => socketCluster.connect({hostname: DEV_CFG.url, port: DEV_CFG.port}));