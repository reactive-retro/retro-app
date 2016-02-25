angular.module('retro')
    .service('socketCluster', ($window) => $window.socketCluster)
    .service('socket', (AuthData, $stateWrapper, Config, Toaster, socketCluster, socketManagement) => {
        AuthData.update({ canConnect: true });

        const socket = socketCluster.connect({
            protocol: Config[Config._cfg].protocol,
            hostname: Config[Config._cfg].url,
            port: Config[Config._cfg].port
        });

        const codes = {
            1006: 'Unable to connect to game server.'
        };

        socket.on('error', e => {
            if(!codes[e.code]) return;
            if(e.code === 1006) { AuthData.update({ canConnect: false, attemptAutoLogin: false, isLoggedIn: false }); }
            Toaster.show(codes[e.code]);
        });

        socket.on('connect', () => {
            AuthData.update({ canConnect: true, attemptAutoLogin: true });
        });

        socket.on('disconnect', () => {
            $stateWrapper.noGoingBackAndNoCache('home');
        });

        socketManagement.setUpEvents(socket);

        return socket;
    })
    .service('socketManagement', (Player, Skills, Places, Monsters, Battle, Options) => {
        return {
            setUpEvents: (socket) => {
                socket.on('update:player', Player.set);
                socket.on('update:skills', Skills.set);
                socket.on('update:places', Places.set);
                socket.on('update:options', Options.set);
                socket.on('update:monsters', Monsters.set);
                socket.on('combat:entered', Battle.set);

                Battle.setSocket(socket);
            }
        };
    });