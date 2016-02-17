angular.module('retro').service('AuthFlow', ($q, AuthData, Toaster, $localStorage, $state, $stateWrapper, Player, Settings, LocationWatcher, Config, socket) => {
    const flow = {
        toPlayer: () => {
            if(!_.contains(['home', 'create'], $state.current.name)) { return; }

            $stateWrapper.noGoingBack('player');
        },
        tryAutoLogin: () => {
            if(!$localStorage.profile || !$localStorage.profile.user_id) return;

            AuthData.update({ attemptAutoLogin: true });
            flow.login(_.clone($localStorage), true);
            AuthData.update({ attemptAutoLogin: false });
        },
        tryAuth: () => {
            const fail = () => $stateWrapper.go('create');

            if($localStorage.profile.user_id) {
                flow.login(_.clone($localStorage), true).then(null, fail);

            // only fail to the char create screen if there's a server connection
            } else if(AuthData.get().canConnect) {
                fail();
            }
        },
        login: (NewHeroProto, swallow = false) => {
            const defer = $q.defer();

            const NewHero = {
                name: NewHeroProto.name,
                profession: NewHeroProto.profession,
                userId: NewHeroProto.profile.user_id,
                token: NewHeroProto.token
            };

            const currentLocation = LocationWatcher.current();
            if(!currentLocation) {
                AuthData.update({ attemptAutoLogin: false });
                return Toaster.show('No current location. Is your GPS on?');
            }

            NewHero.homepoint = { lat: currentLocation.latitude, lon: currentLocation.longitude };

            socket.emit('login', NewHero, (err, success) => {
                if(err) {
                    defer.reject();
                } else {
                    defer.resolve();
                    _.extend(Settings, success.settings);
                    flow.toPlayer();
                    flow.isLoggedIn = true;
                    $localStorage.env = Config._cfg;
                }

                AuthData.update({ attemptAutoLogin: true });

                if(!swallow) {
                    const msgObj = err ? err : success;
                    Toaster.show(msgObj.msg);
                }
            });

            Settings.isReady = defer.promise;
            return Settings.isReady;
        }
    };

    return flow;
});