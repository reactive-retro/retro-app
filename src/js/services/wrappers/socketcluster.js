angular.module('retro')
    .service('socketCluster', ($window) => $window.socketCluster)
    .service('socket', (AuthData, $window, $timeout, $stateWrapper, Config, Toaster, socketCluster, socketManagement) => {
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
            $window.localStorage.removeItem('socketCluster.authToken');
            $stateWrapper.noGoingBackAndNoCache('home');
            $timeout(() => $window.location.reload(true));
        });

        socketManagement.setUpEvents(socket);

        return socket;
    })
    .service('socketManagement', (Player, Skills, Places, Monsters, Battle, Options, Party) => {
        return {
            setUpEvents: (socket) => {
                socket.on('update:party', Party.set);
                socket.on('update:player', Player.set);
                socket.on('update:skills', Skills.set);
                socket.on('update:places', Places.set);
                socket.on('update:options', Options.set);
                socket.on('update:monsters', Monsters.set);
                socket.on('update:monsters:push', Monsters.push);
                socket.on('combat:entered', Battle.set);

                Party.setSocket(socket);
                Battle.setSocket(socket);
            }
        };
    });