angular.module('retro').service('AuthFlow', ($q, $ionicHistory, $cordovaToast, $localStorage, $state, Player, LocationWatcher, socket) => {
    var flow = {
        toPlayer: () => {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('player');
        },
        tryAuth: () => {
            var fail = () => $state.go('create');


            if($localStorage.profile.user_id) { // jshint ignore:line
                flow.login(_.clone($localStorage), true).then(null, fail);
            } else {
                fail();
            }
        },
        login: (NewHeroProto, swallow = false) => {
            var defer = $q.defer();

            var NewHero = {
                name: NewHeroProto.name,
                profession: NewHeroProto.profession,
                user_id: NewHeroProto.profile.user_id,
                token: NewHeroProto.token
            };

            console.log(JSON.stringify(NewHero));

            var currentLocation = LocationWatcher.current();
            if(!currentLocation) {
                return $cordovaToast.showLongBottom('No current location. Is your GPS on?');
            }

            NewHero.homepoint = { lat: currentLocation.latitude, lon: currentLocation.longitude };

            socket.emit('login', NewHero, (err, success) => {
                if(err) {
                    defer.reject();
                } else {
                    defer.resolve();
                    Player.set(success.player);
                    flow.toPlayer();
                }

                if(!swallow) {
                    var msgObj = err ? err : success;
                    $cordovaToast.showLongBottom(msgObj.msg);
                }
            });

            return defer.promise;
        }
    };
    return flow;
});