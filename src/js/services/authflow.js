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

            if($localStorage.facebookId) {
                flow.login($localStorage, true).then(null, fail);
            } else {
                fail();
            }
        },
        login: (NewHero, swallow = false) => {
            var defer = $q.defer();

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