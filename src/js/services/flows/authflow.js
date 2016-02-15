angular.module('retro').service('AuthFlow', ($q, $rootScope, $ionicHistory, Toaster, $localStorage, $state, Player, Settings, LocationWatcher, Config, socket) => {
    const flow = {
        toPlayer: () => {
            if(!_.contains(['home', 'create'], $state.current.name)) { return; }

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('player');
        },
        tryAuth: () => {
            const fail = () => $state.go('create');

            if($localStorage.profile.user_id) {
                flow.login(_.clone($localStorage), true).then(null, fail);

            // only fail to the char create screen if there's a server connection
            } else if($rootScope.canConnect) {
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
                $rootScope.attemptAutoLogin = false;
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

                $rootScope.attemptAutoLogin = false;

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