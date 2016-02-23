angular.module('retro').service('AuthFlow', ($q, AuthData, Toaster, $localStorage, $state, $stateWrapper, Player, Settings, BlockState, Config, socket) => {
    const unsetAutoLogin = () => {
        AuthData.update({ attemptAutoLogin: false });
    };

    const flow = {
        toPlayer: () => {
            if(!_.contains(['home', 'create'], $state.current.name)) return;

            $stateWrapper.noGoingBack('player');
        },
        tryAutoLogin: () => {
            if(!$localStorage.profile || !$localStorage.profile.user_id) {
                unsetAutoLogin();
                return;
            }
            flow.login(_.cloneDeep($localStorage), true).then(null, unsetAutoLogin);
        },
        tryAuth: () => {
            const fail = (val) => {
                unsetAutoLogin();
                if(!val) return;
                $stateWrapper.go('create');
            };

            if($localStorage.profile.user_id) {
                flow.login(_.cloneDeep($localStorage), true).then(null, fail);

            // only fail to the char create screen if there's a server connection
            } else if(AuthData.get().canConnect) {
                fail();
            }
        },
        login: (NewHeroProto, swallow = false) => {
            const defer = $q.defer();
            if(BlockState.get().Login || AuthData.get().isLoggedIn) {
                defer.reject(false);
                return defer.promise;
            }

            const NewHero = {
                name: NewHeroProto.name,
                profession: NewHeroProto.profession,
                userId: NewHeroProto.profile.user_id,
                token: NewHeroProto.token,
                homepoint: NewHeroProto.homepoint
            };

            BlockState.block('Login');
            socket.emit('login', NewHero, (err, success) => {
                BlockState.unblock('Login');
                if(err) {
                    defer.reject(true);
                } else {
                    defer.resolve();
                    _.extend(Settings, success.settings);
                    flow.toPlayer();
                    AuthData.update({ isLoggedIn: true });
                    $localStorage.env = Config._cfg;
                    BlockState.unblockAll();
                }

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