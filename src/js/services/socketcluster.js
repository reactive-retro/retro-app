angular.module('retro')
    .service('socketCluster', ($window) => $window.socketCluster)
    .service('socket', ($rootScope, Config, Toaster, socketCluster) => {
        $rootScope.canConnect = true;

        const socket = socketCluster.connect({
            protocol: Config[Config._cfg].protocol,
            hostname: Config[Config._cfg].url, port:
            Config[Config._cfg].port
        });

        const codes = {
            1006: 'Unable to connect to game server.'
        };

        socket.on('error', e => {
            if(!codes[e.code]) { return; }
            if(e.code === 1006) { $rootScope.canConnect = false; }
            Toaster.show(codes[e.code]);
        });

        socket.on('connect', () => {
            $rootScope.canConnect = true;
        });

        return socket;
    });