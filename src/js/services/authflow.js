angular.module('retro').service('AuthFlow', ($q, $ionicHistory, $cordovaToast, $localStorage, $state, socket) => {
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
                flow.login($localStorage).then(null, fail);
            } else {
                fail();
            }
        },
        login: (NewHero) => {
            var defer = $q.defer();

            socket.emit('login', NewHero, (err, success) => {
                if(err) {
                    defer.reject();
                } else {
                    defer.resolve();
                    flow.toPlayer();
                }

                var msgObj = err ? err : success;
                $cordovaToast.showLongBottom(msgObj.msg);
                console.log(JSON.stringify(err), JSON.stringify(success));
            });

            return defer.promise;
        }
    };
    return flow;
});