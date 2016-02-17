'use strict';

angular.module('retro', ['ionic', 'ngCordova', 'ngStorage', 'auth0', 'angular-jwt']);
'use strict';

angular.module('retro').constant('Config', {
    _cfg: 'DEV',
    DEV: {
        url: '127.0.0.1',
        port: 8080
    },
    PROD: {
        protocol: 'https',
        url: 'reactive-retro.herokuapp.com',
        port: 80
    }
});
'use strict';

angular.module('retro').config(["authProvider", function (authProvider) {
    authProvider.init({
        domain: 'reactive-retro.auth0.com',
        clientID: 'ucMSnNDYLGdDBL2uppganZv2jKzzJiI0',
        loginState: 'home'
    });
}]).run(["auth", "$localStorage", "$rootScope", "$stateWrapper", "jwtHelper", "AuthData", "AuthFlow", "Config", function (auth, $localStorage, $rootScope, $stateWrapper, jwtHelper, AuthData, AuthFlow, Config) {
    auth.hookEvents();

    if (Config._cfg !== $localStorage.env) {
        $localStorage.profile = $localStorage.token = $localStorage.refreshingToken = null;
        return;
    }

    var autologin = function autologin() {
        if (!auth.isAuthenticated) return;
        AuthFlow.tryAutoLogin();
    };

    var refreshingToken = null;
    $rootScope.$on('$locationChangeStart', function (e, n, c) {
        // if you route to the same state and aren't logged in, don't do this event
        // it causes the login events on the server to fire twice
        if (n === c) return;
        if (AuthFlow.isLoggedIn) return;

        var token = $localStorage.token;
        var refreshToken = $localStorage.refreshToken;
        var profile = $localStorage.profile;

        if (!token) {
            return;
        }

        if (!jwtHelper.isTokenExpired(token)) {
            if (!auth.isAuthenticated) {
                auth.authenticate(profile, token);
            }
            autologin();
            return;
        }

        if (refreshToken) {
            if (refreshingToken === null) {
                refreshingToken = auth.refreshIdToken(refreshToken).then(function (idToken) {
                    $localStorage.token = idToken;
                    auth.authenticate(profile, idToken);
                    autologin();
                }).finally(function () {
                    refreshingToken = null;
                });
            }
            return refreshingToken;
        }

        $stateWrapper.go('home');
    });
}]);
'use strict';

angular.module('retro').run(["$rootScope", "$ionicPlatform", function ($rootScope, $ionicPlatform) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        $rootScope.hideMenu = toState.name === 'home' || toState.name === 'create' || toState.name === 'battle';
    });

    $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
    }, 100);

    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    });
}]);
'use strict';

angular.module('retro').config(["$ionicConfigProvider", "$urlRouterProvider", "$stateProvider", function ($ionicConfigProvider, $urlRouterProvider, $stateProvider) {

    $ionicConfigProvider.views.swipeBackEnabled(false);

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'index',
        controller: 'HomeController'
    }).state('create', {
        url: '/create',
        templateUrl: 'createchar',
        controller: 'CreateCharacterController',
        data: { requiresLogin: true }
    }).state('player', {
        url: '/player',
        templateUrl: 'player',
        controller: 'PlayerController',
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('changeclass', {
        url: '/changeclass',
        templateUrl: 'changeclass',
        controller: 'ClassChangeController',
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('changeskills', {
        url: '/changeskills',
        templateUrl: 'changeskills',
        controller: 'SkillChangeController',
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('inventory', {
        url: '/inventory',
        templateUrl: 'inventory',
        controller: 'InventoryController',
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('inventory.armor', {
        url: '/armor',
        views: {
            'armor-tab': {
                templateUrl: 'inventory-tab-armor'
            }
        },
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('inventory.weapons', {
        url: '/weapons',
        views: {
            'weapons-tab': {
                templateUrl: 'inventory-tab-weapons'
            }
        },
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('inventory.items', {
        url: '/items',
        views: {
            'items-tab': {
                templateUrl: 'inventory-tab-items'
            }
        },
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('options', {
        url: '/options',
        templateUrl: 'options',
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('explore', {
        url: '/explore',
        templateUrl: 'explore',
        controller: 'ExploreController',
        data: { requiresLogin: true },
        cache: false,
        resolve: {
            playerLoaded: ["$injector", function playerLoaded($injector) {
                return $injector.get('Settings').isReady;
            }]
        }
    }).state('battle', {
        url: '/battle',
        templateUrl: 'battle',
        controller: 'BattleController',
        cache: false,
        data: { requiresLogin: true }
    });
}]);
'use strict';

angular.module('retro').constant('CLASSES', {
    Cleric: 'Clerics specialize in healing their companions.',
    Fighter: 'Fighters specialize in making their enemies hurt via physical means.',
    Mage: 'Mages specialize in flinging magic at their enemies -- sometimes multiple at once!',
    Thief: 'Thieves specialize in quick attacks and physical debuffing.'
});
'use strict';

angular.module('retro').constant('OAUTH_KEYS', {
    google: '195531055167-99jquaolc9p50656qqve3q913204pmnp.apps.googleusercontent.com',
    reddit: 'CKzP2LKr74VwYw',
    facebook: '102489756752863'
});
'use strict';

angular.module('retro').constant('MAP_COLORS', {
    monster: {
        outline: '#ff0000',
        fill: '#aa0000'
    },
    poi: {
        outline: '#ffff00',
        fill: '#aaaa00'
    },
    homepoint: {
        outline: '#00ff00',
        fill: '#00aa00'
    },
    miasma: {
        outline: '#000000',
        fill: '#000000'
    },
    hero: {
        outline: '#0000ff',
        fill: '#0000aa'
    },
    heroRadius: {
        outline: '#ff00ff',
        fill: '#ff00ff'
    }
});
'use strict';

angular.module('retro').constant('MAP_STYLE', [{
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }, { color: '#aee2e0' }]
}, {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#abce83' }]
}, {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ visibility: 'simplified' }, { color: '#8dab68' }]
}, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ visibility: 'simplified' }]
}, {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5B5B3F' }]
}, {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ABCE83' }]
}, {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#A4C67D' }]
}, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#9BBF72' }]
}, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#EBF4A4' }]
}, {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }, { color: '#87ae79' }]
}, {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{ color: '#7f2200' }, { visibility: 'off' }]
}, {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { visibility: 'on' }, { weight: 4.1 }]
}, {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#495421' }]
}, {
    featureType: 'administrative.neighborhood',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'administrative.locality',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
}]);
'use strict';

angular.module('retro').controller('BattleController', ["$scope", "$ionicModal", "BattleFlow", "Battle", "Dice", "Player", "Skills", function ($scope, $ionicModal, BattleFlow, Battle, Dice, Player, Skills) {
    $scope.battleFlow = BattleFlow;
    $scope.currentPlayerName = Player.get().name;
    $scope.targets = {};
    $scope.multiplier = 1;

    var modals = {
        targetModal: null,
        resultsModal: null
    };

    $scope.me = null;

    var resultHandler = function resultHandler(_ref) {
        var battle = _ref.battle;
        var actions = _ref.actions;
        var isDone = _ref.isDone;

        Battle.set(battle);
        $scope.disableActions = false;
        $scope.targets = {};
        $scope.results = actions;
        $scope.isDone = isDone;
        modals.resultsModal.show();
        if (isDone) {
            Battle.set(null);
        }
    };

    var setupBattleData = function setupBattleData() {
        $scope.battle = Battle.get();
        if (!$scope.battle) return;
        $scope.battle.actionChannel.watch($scope.setTarget);

        $scope.battle.resultsChannel.watch(resultHandler);

        // self shows up last
        $scope.orderedPlayers = _($scope.battle.players).sortBy(function (player) {
            return player === $scope.currentPlayerName ? '~' : player;
        }).map(function (playerName) {
            return _.find($scope.battle.playerData, { name: playerName });
        }).value();

        $scope.me = _.find($scope.battle.playerData, { name: $scope.currentPlayerName });

        $scope.uniqueSkills = _($scope.me.skills).reject(function (skill) {
            return skill === 'Attack';
        }).compact().uniq().map(function (skill) {
            return _.find(Skills.get(), { spellName: skill });
        }).value();
    };

    $scope.getMultiplier = function (skill) {
        return _.filter($scope.me.skills, function (check) {
            return check === skill;
        }).length;
    };

    $scope.skillCooldown = function (skill) {
        return $scope.getMultiplier(skill ? skill.spellName : '') * (skill ? skill.spellCooldown : 0);
    };
    $scope.canCastSkillCD = function (skill) {
        var skillName = skill ? skill.spellName : '';
        return !$scope.me.cooldowns[skillName] || $scope.me.cooldowns[skillName] <= 0;
    };

    $scope.skillCost = function (skill) {
        return $scope.getMultiplier(skill ? skill.spellName : '') * (skill ? skill.spellCost : 0);
    };
    $scope.canCastSkillMP = function (skill) {
        return $scope.skillCost(skill) <= $scope.me.stats.mp.__current;
    };

    $scope.openSkillInfo = function (skill) {
        $scope.activeSkill = _.find(Skills.get(), { spellName: skill });

        $scope.multiplier = $scope.getMultiplier($scope.activeSkill.spellName);
        if (skill === 'Attack') {
            $scope.multiplier += 1;
        }

        var skillRef = $scope.activeSkill;
        $scope.activeSkillAttrs = _(skillRef.spellEffects).keys().map(function (key) {
            var stats = Dice.statistics(skillRef.spellEffects[key].roll, $scope.me.stats);
            return { name: key, value: stats, extra: skillRef.spellEffects[key], accuracy: $scope.me.stats.acc };
        })
        // Damage always comes first
        .sortBy(function (obj) {
            return obj.name === 'Damage' ? '*' : obj.name;
        }).value();

        modals.targetModal.show();
    };

    $scope.target = {
        monster: function monster(_monster) {
            return $scope.prepareTarget({ name: _monster.name, id: _monster.id, skill: $scope.activeSkill.spellName });
        },
        player: function player(_player) {
            return $scope.prepareTarget({ name: _player.name, id: _player.name, skill: $scope.activeSkill.spellName });
        },
        other: function other(_other) {
            return $scope.prepareTarget({ name: _other, id: _other, skill: $scope.activeSkill.spellName });
        }
    };

    $scope.closeModal = function (modal) {
        modals[modal].hide();
        if ($scope.isDone) {
            BattleFlow.toExplore();
        }
    };

    $scope.prepareTarget = function (target) {
        target.origin = $scope.currentPlayerName;
        $scope.setTarget(target);
        $scope.battle.actionChannel.publish(target);
        $scope.canConfirm = true;
        $scope.closeModal('targetModal');
    };

    $scope.setTarget = function (target) {
        $scope.targets[target.origin] = target;
    };

    $scope.confirmAction = function () {
        $scope.canConfirm = false;
        $scope.disableActions = true;
        BattleFlow.confirmAction($scope.targets[$scope.currentPlayerName]);
    };

    $ionicModal.fromTemplateUrl('choosetarget.info', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        modals.targetModal = modal;
    });

    $ionicModal.fromTemplateUrl('results.info', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        modals.resultsModal = modal;
    });

    // clean up modal b/c memory
    $scope.$on('$destroy', function () {
        modals.targetModal.remove();
        modals.resultsModal.remove();
    });

    setupBattleData();
    Battle.observer().then(null, null, setupBattleData);

    /*
    TODO make buffbar
        - ion-flash - shocked
        - ion-eye-disabled - blinded
        - ion-fireball - burned
        - ion-ios-snowy - frozen
        - ion-load-b - stunned
     */
}]);
'use strict';

angular.module('retro').controller('ClassChangeController', ["$scope", "Player", "CLASSES", "ClassChangeFlow", function ($scope, Player, CLASSES, ClassChangeFlow) {
    $scope.player = Player.get();
    $scope.CLASSES = CLASSES;
    $scope.ClassChangeFlow = ClassChangeFlow;

    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
}]);
'use strict';

angular.module('retro').controller('CreateCharacterController', ["$scope", "NewHero", "CLASSES", "AuthFlow", "$localStorage", function ($scope, NewHero, CLASSES, AuthFlow, $localStorage) {
    $scope.NewHero = NewHero;
    $scope.CLASSES = CLASSES;
    $scope.baseProfessions = ['Thief', 'Mage', 'Fighter'];

    $scope.create = function () {
        var hero = _.merge(NewHero, $localStorage);
        AuthFlow.login(hero);
    };
}]);
'use strict';

angular.module('retro').controller('ExploreController', ["$scope", "$ionicLoading", "Player", "LocationWatcher", "Google", "MapDrawing", "Places", "Monsters", "BattleFlow", function ($scope, $ionicLoading, Player, LocationWatcher, Google, MapDrawing, Places, Monsters, BattleFlow) {

    $scope.currentlySelected = null;
    $scope.centered = true;

    var unCenter = function unCenter() {
        return $scope.centered = false;
    };

    $scope.mapCreated = function (map) {
        $scope.map = map;
        var position = LocationWatcher.current();
        MapDrawing.drawMe(map, position);
        $scope.centerOn(position);
        MapDrawing.drawHomepoint(map, Player.get().homepoint);
        $scope.findMe();
        $scope.watchMe();
        MapDrawing.drawPlaces(map, Places.get());
        MapDrawing.drawMonsters(map, Monsters.get(), $scope.select);
        MapDrawing.addMapEvents(map, unCenter);
    };

    $scope.fight = function () {
        BattleFlow.start($scope.currentlySelected.monster);
    };

    $scope.centerOnMe = function () {
        $scope.findMe();
        $scope.centered = true;
    };

    var _setSelected = function _setSelected(opts) {
        $scope.currentlySelected = opts;
        $scope.$apply();
    };

    $scope.select = function (opts) {
        $scope.reset();
        _setSelected(opts);
    };

    $scope.reset = function () {
        if ($scope.currentlySelected && $scope.currentlySelected.infoWindow) {
            $scope.currentlySelected.infoWindow.close();
        }
        _setSelected(null);
    };

    $scope.findMe = function () {
        LocationWatcher.ready.then(function (coords) {
            return $scope.centerOn(coords, true);
        });
    };

    $scope.watchMe = function () {
        LocationWatcher.watch.then(null, null, function (coords) {
            $scope.centerOn(coords, !$scope.centered);
        });
    };

    $scope.centerOn = function (coords) {
        var centerMap = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        if (!$scope.map) return;
        if (!coords.latitude || !coords.longitude) return;
        var position = new Google.maps.LatLng(coords.latitude, coords.longitude);

        if (centerMap) {
            $scope.map.setCenter(position);
        }

        MapDrawing.setCurrentPosition(position);
    };
}]);
'use strict';

angular.module('retro').controller('HomeController', ["$scope", "LocationWatcher", "Auth", "AuthData", function ($scope, LocationWatcher, Auth, AuthData) {
    $scope.auth = Auth;
    $scope.authData = AuthData.get();

    $scope.coords = LocationWatcher.current();
    LocationWatcher.watch.then(null, null, function (coords) {
        $scope.coords = coords;
        if ($scope.authData.attemptAutoLogin) {
            Auth.autoLogin();
        }
    });

    AuthData.observer.then(null, null, function (val) {
        $scope.authData = val;
        if (val.attemptAutoLogin) {
            Auth.autoLogin();
        }
    });
}]);
'use strict';

angular.module('retro').controller('InventoryController', ["$scope", "Player", "EquipFlow", function ($scope, Player, EquipFlow) {
    $scope.player = Player.get();
    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
    $scope.isEmpty = _.isEmpty;

    $scope.EquipFlow = EquipFlow;
}]);
'use strict';

angular.module('retro').controller('MenuController', ["$scope", "$state", "$stateWrapper", "$ionicPopup", "Auth", "LocationWatcher", "Toaster", function ($scope, $state, $stateWrapper, $ionicPopup, Auth, LocationWatcher, Toaster) {

    var logoutCheck = function logoutCheck() {
        $ionicPopup.confirm({
            title: 'Log out?',
            template: 'Are you sure you want to log out?'
        }).then(function (res) {
            if (!res) {
                return;
            }
            Auth.logout();
        });
    };

    $scope.stateHref = $state.href;

    $scope.menu = [{ icon: 'ion-person', name: 'Player', state: 'player' }, { icon: 'ion-earth', name: 'Explore', state: 'explore', requiresLocation: true }, { icon: 'ion-briefcase', name: 'Inventory', state: 'inventory' }, { icon: 'ion-university', name: 'Skills', state: 'changeskills' }, { icon: 'ion-gear-b', name: 'Options', state: 'options' }, { icon: 'ion-android-exit', name: 'Logout', call: logoutCheck }];

    $scope.doMenuAction = function (menuObj) {
        if (menuObj.call) return menuObj.call();
        if (menuObj.requiresLocation && !$scope.coords) return Toaster.show('Your GPS needs to be enabled to see this.');
        $stateWrapper.noGoingBackAndNoCache(menuObj.state);
    };

    $scope.coords = LocationWatcher.current();
    LocationWatcher.watch.then(null, null, function (coords) {
        return $scope.coords = coords;
    });
}]);
'use strict';

angular.module('retro').controller('PlayerController', ["$scope", "$stateWrapper", "Player", function ($scope, $stateWrapper, Player) {
    $scope.player = Player.get();
    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
    $scope.isEmpty = _.isEmpty;

    $scope.go = $stateWrapper.go;
}]);
'use strict';

angular.module('retro').controller('SkillChangeController', ["$scope", "$ionicModal", "Player", "Skills", "SkillChangeFlow", "Dice", function ($scope, $ionicModal, Player, Skills, SkillChangeFlow, Dice) {
    $scope.player = Player.get();

    var getAllSkills = function getAllSkills(baseSkills) {
        return _(baseSkills).each(function (skill) {
            return skill.spellLevel = skill.spellClasses[_.keys(skill.spellClasses)[0]];
        }).sortBy(['spellLevel', 'spellName']).groupBy(function (skill) {
            return _.keys(skill.spellClasses)[0];
        }).reduce(function (res, val, key) {
            res.push({ prof: key, profSkills: val });
            return res;
        }, []);
    };

    $scope.allSkills = getAllSkills(Skills.get());

    $scope.openSkillInfo = function (skill) {
        $scope.activeSkill = skill;
        $scope.activeSkillAttrs = _(skill.spellEffects).keys().map(function (key) {
            var stats = Dice.statistics(skill.spellEffects[key].roll, $scope.player.stats);
            return { name: key, value: stats, extra: skill.spellEffects[key] };
        })
        // Damage always comes first
        .sortBy(function (obj) {
            return obj.name === 'Damage' ? '*' : obj.name;
        }).value();

        $scope.modal.show();
    };

    $scope.countNumTimesSkillSet = function (skillName) {
        return _.filter($scope.player.skills, function (skill) {
            return skill === skillName;
        }).length;
    };

    $scope.setSkillInSlot = function (skill, slot) {
        // unset skill
        if ($scope.player.skills[slot] === skill) {
            SkillChangeFlow.change(null, slot);
            return;
        }

        // set skill
        SkillChangeFlow.change(skill, slot);
    };

    $scope.closeSkillInfo = function () {
        return $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('changeskill.info', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // clean up modal b/c memory
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
    Skills.observer.then(null, null, function (skills) {
        return $scope.allSkills = getAllSkills(skills);
    });
}]);
'use strict';

angular.module('retro').directive('colorText', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            preText: '@'
        },
        template: '\n                <span ng-class="{assertive: value < 0, balanced: value > 0}">{{preText}} {{value}}</span>\n            '
    };
});
'use strict';

angular.module('retro').directive('cooldown', function () {
    return {
        restrict: 'E',
        scope: {
            turns: '='
        },
        template: '\n                <span>\n                    <i class="icon ion-clock"></i> <ng-pluralize count="turns", when="{\'0\': \'Instant\', \'one\': \'1 round\', \'other\': \'{} rounds\'}"></ng-pluralize>\n                </span>\n            '
    };
});
'use strict';

angular.module('retro').directive('healthDisplay', function () {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: '\n                <div>\n                    <i class="icon ion-heart assertive"></i> {{target.stats.hp.__current}} / {{target.stats.hp.maximum}}\n                </div>\n            '
    };
});
'use strict';

angular.module('retro').directive('manaDisplay', function () {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: '\n                <div>\n                    <i class="icon ion-waterdrop positive"></i> {{target.stats.mp.__current}} / {{target.stats.mp.maximum}}\n                </div>\n            '
    };
});
'use strict';

angular.module('retro').directive('map', ["MAP_STYLE", "Toaster", "Google", function (MAP_STYLE, Toaster, Google) {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&',
            onClick: '&'
        },
        link: function link($scope, $element) {

            if (!Google || !Google.maps) {
                Toaster.show('Could not reach google.');
                return;
            }

            // this is the available list of places in the game
            var init = function init() {
                var mapOptions = {
                    center: new Google.maps.LatLng(32.3078, -64.7505),
                    zoom: 17,
                    mapTypeId: Google.maps.MapTypeId.ROADMAP,
                    draggable: true,
                    minZoom: 15,
                    maxZoom: 17,
                    styles: MAP_STYLE,
                    mapTypeControlOptions: { mapTypeIds: [] },
                    overviewMapControl: false,
                    streetViewControl: false,
                    zoomControl: false
                };

                var map = new Google.maps.Map($element[0], mapOptions);

                $scope.onCreate({ map: map });

                Google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                    $scope.onClick();
                    e.preventDefault();
                    return false;
                });
            };

            if (document.readyState === 'complete') {
                init();
            } else {
                Google.maps.event.addDomListener(window, 'load', init);
            }
        }
    };
}]);
'use strict';

angular.module('retro').directive('mpCost', function () {
    return {
        restrict: 'E',
        scope: {
            cost: '='
        },
        template: '\n                <span>\n                    <i class="icon ion-waterdrop positive"></i> {{cost}} mp\n                </span>\n            '
    };
});
'use strict';

angular.module('retro').directive('skillEffectDisplay', function () {
    return {
        restrict: 'E',
        scope: {
            effects: '=',
            multiplier: '='
        },
        template: '\n                <div class="row" ng-repeat="effect in effects">\n                    <div class="col col-20 col-offset-20 text-right">\n                        <strong>{{effect.name}}</strong>\n                    </div>\n\n                    <div class="col text-left">\n                        <span>{{effect.value.min_possible * multiplier}}</span>\n                        <span ng-if="effect.value.min_possible !== effect.value.max_possible">- {{effect.value.max_possible*multiplier}}</span>\n                        <ng-pluralize ng-if="effect.extra.string" count="effect.value.max_possible*multiplier" when="{\'one\': \' \'+effect.extra.string, \'other\': \' \'+effect.extra.string+\'s\'}"></ng-pluralize>\n                        <span ng-if="effect.extra.chance"> ({{effect.extra.chance + effect.accuracy}}% chance)</span>\n                    </div>\n                </div>\n            '
    };
});
'use strict';

angular.module('retro').directive('statBar', function () {
    return {
        restrict: 'E',
        scope: {
            target: '=',
            stat: '@'
        },
        template: '\n                <div class="stat-bar-container">\n                    <div class="stat-bar {{stat}}" style="width: {{target.stats[stat].__current/target.stats[stat].maximum*100}}%"></div>\n                </div>\n            '
    };
});
'use strict';

angular.module('retro').service('Auth', ["$localStorage", "$stateWrapper", "auth", "AuthFlow", function ($localStorage, $stateWrapper, auth, AuthFlow) {

    var localAuth = {
        autoLogin: function autoLogin() {
            return AuthFlow.tryAutoLogin();
        },
        login: function login() {
            auth.signin({
                authParams: {
                    scope: 'openid offline_access email',
                    device: 'Mobile device'
                }
            }, function (profile, token, accessToken, state, refreshToken) {
                $localStorage.profile = profile;
                $localStorage.token = token;
                $localStorage.refreshToken = refreshToken;

                AuthFlow.tryAuth();
            }, function (err) {
                console.log('failed', JSON.stringify(err));
            });
        },
        logout: function logout() {
            auth.signout();
            $localStorage.profile = null;
            $localStorage.token = null;

            $stateWrapper.noGoingBack('home');
        }
    };

    return localAuth;
}]);
'use strict';

angular.module('retro').service('LocationWatcher', ["$q", function ($q) {

    var defer = $q.defer();
    var ready = $q.defer();

    var error = function error() {
        console.log('GPS turned off, or connection errored.');
    };

    var currentCoords = null;

    var watcher = {
        current: function current() {
            return currentCoords;
        },
        start: function start() {
            navigator.geolocation.getCurrentPosition(function (position) {
                currentCoords = position.coords;
                defer.notify(currentCoords);
                ready.resolve(currentCoords);
            }, error, { timeout: 10000 });

            navigator.geolocation.watchPosition(function (position) {
                currentCoords = position.coords;
                defer.notify(currentCoords);
            }, error, { timeout: 10000 });
        },

        ready: ready.promise,
        watch: defer.promise
    };

    watcher.start();

    return watcher;
}]);
'use strict';

angular.module('retro').service('MapDrawing', ["Google", "Settings", "MAP_COLORS", function (Google, Settings, MAP_COLORS) {

    var savedPlaces = [];
    var savedMonsters = [];
    var curPos = {};
    var homepoint = {};
    var miasma = {};

    var MAX_VIEW_RADIUS = Settings.RADIUS; // meters

    var bounds = new Google.maps.LatLngBounds();

    var mercatorWorldBounds = [new Google.maps.LatLng(85, 180), new Google.maps.LatLng(85, 90), new Google.maps.LatLng(85, 0), new Google.maps.LatLng(85, -90), new Google.maps.LatLng(85, -180), new Google.maps.LatLng(0, -180), new Google.maps.LatLng(-85, -180), new Google.maps.LatLng(-85, -90), new Google.maps.LatLng(-85, 0), new Google.maps.LatLng(-85, 90), new Google.maps.LatLng(-85, 180), new Google.maps.LatLng(0, 180), new Google.maps.LatLng(85, 180)];

    // radius in meters
    var drawCircle = function drawCircle(point, radius) {
        var d2r = Math.PI / 180; // degrees to radians
        var r2d = 180 / Math.PI; // radians to degrees
        var earthsradius = 3963; // 3963 is the radius of the earth in miles
        var points = 32;

        // find the radius in lat/lon - convert meters to miles
        var rlat = radius * 0.000621371192 / earthsradius * r2d;
        var rlng = rlat / Math.cos(point.lat() * d2r);

        var start = points + 1;
        var end = 0;

        var extp = [];

        for (var i = start; i > end; i--) {
            var theta = Math.PI * (i / (points / 2));
            var ey = point.lng() + rlng * Math.cos(theta); // center a + radius x * cos(theta)
            var ex = point.lat() + rlat * Math.sin(theta); // center b + radius y * sin(theta)
            extp.push(new Google.maps.LatLng(ex, ey));
            bounds.extend(extp[extp.length - 1]);
        }
        return extp;
    };

    var drawPlaces = function drawPlaces(map, places) {
        _.each(savedPlaces, function (place) {
            return place.setMap(null);
        });
        _.each(places, function (place) {
            savedPlaces.push(new Google.maps.Marker({
                position: place.geometry.location,
                map: map,
                icon: {
                    path: Google.maps.SymbolPath.CIRCLE,
                    strokeColor: MAP_COLORS.poi.outline,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: MAP_COLORS.poi.fill,
                    fillOpacity: 1,
                    scale: 5
                }
            }));
        });
    };

    var drawMonsters = function drawMonsters(map, monsters) {
        var click = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

        _.each(savedMonsters, function (monster) {
            return monster.setMap(null);
        });
        _.each(monsters, function (monster) {
            var monsterMarker = new Google.maps.Marker({
                position: new Google.maps.LatLng(monster.location.lat, monster.location.lon),
                map: map,
                icon: {
                    path: Google.maps.SymbolPath.CIRCLE,
                    strokeColor: MAP_COLORS.monster.outline,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: MAP_COLORS.monster.fill,
                    fillOpacity: 1,
                    scale: 5
                }
            });

            monsterMarker.addListener('click', function () {

                var infoWindow = new Google.maps.InfoWindow({
                    content: monster.name
                });

                infoWindow.open(map, monsterMarker);

                click({ monster: monster, infoWindow: infoWindow });
            });

            savedMonsters.push(monsterMarker);
        });
    };

    var drawHomepoint = function drawHomepoint(map, coords) {
        var homepointCenter = new Google.maps.LatLng(coords.lat, coords.lon);

        homepoint = new Google.maps.Marker({
            position: homepointCenter,
            map: map,
            icon: {
                path: Google.maps.SymbolPath.CIRCLE,
                strokeColor: MAP_COLORS.homepoint.outline,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: MAP_COLORS.homepoint.fill,
                fillOpacity: 1,
                scale: 5
            }
        });
        homepoint;

        var miasmaOptions = {
            strokeColor: MAP_COLORS.miasma.outline,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: MAP_COLORS.miasma.fill,
            fillOpacity: 0.35,
            map: map,
            paths: [mercatorWorldBounds, drawCircle(homepointCenter, MAX_VIEW_RADIUS)]
        };

        miasma = new Google.maps.Polygon(miasmaOptions);
        miasma; // no unused vars
    };

    var drawMe = function drawMe(map, coords) {
        curPos = new Google.maps.Marker({
            position: new Google.maps.LatLng(coords.latitude, coords.longitude),
            map: map,
            icon: {
                path: Google.maps.SymbolPath.CIRCLE,
                strokeColor: MAP_COLORS.hero.outline,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: MAP_COLORS.hero.fill,
                fillOpacity: 1,
                scale: 5
            }
        });

        var affectRadius = new Google.maps.Circle({
            fillColor: MAP_COLORS.heroRadius.fill,
            strokeColor: MAP_COLORS.heroRadius.outline,
            strokeWeight: 1,
            radius: 50,
            map: map
        });

        affectRadius.bindTo('center', curPos, 'position');
    };

    var addMapEvents = function addMapEvents(map) {
        var dragCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

        var lastValidCenter = null;

        Google.maps.event.addListener(map, 'drag', dragCallback);

        Google.maps.event.addListener(map, 'center_changed', function () {
            if (bounds.contains(map.getCenter())) {
                lastValidCenter = map.getCenter();
                return;
            }

            map.panTo(lastValidCenter);
        });
    };

    var setCurrentPosition = function setCurrentPosition(pos) {
        return curPos.setPosition(pos);
    };

    return {
        addMapEvents: addMapEvents,
        drawPlaces: drawPlaces,
        drawHomepoint: drawHomepoint,
        drawMe: drawMe,
        drawMonsters: drawMonsters,

        setCurrentPosition: setCurrentPosition
    };
}]);
'use strict';

angular.module('retro').service('NewHero', function () {
    return {
        profession: 'Fighter'
    };
});
'use strict';

angular.module('retro').service('Settings', function () {});
'use strict';

angular.module('retro').service('Toaster', ["$cordovaToast", function ($cordovaToast) {

    var show = function show(msg) {
        try {
            $cordovaToast.showLongBottom(msg);
        } catch (e) {
            console.log(msg);
        }
    };

    var handleDefault = function handleDefault() {
        var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
        return function (err, success) {
            var msgObj = err ? err : success;
            show(msgObj.msg);

            callback();
        };
    };

    return {
        show: show,
        handleDefault: handleDefault
    };
}]);
'use strict';

angular.module('retro').service('AuthData', ["$q", function ($q) {

    var defer = $q.defer();

    var value = {
        canConnect: false,
        attemptAutoLogin: true
    };

    var update = function update(opts) {
        _.extend(value, opts);
        defer.notify(value);
    };

    return {
        observer: defer.promise,
        update: update,
        get: function get() {
            return value;
        }
    };
}]);
'use strict';

angular.module('retro').service('Battle', ["$q", "$stateWrapper", "Player", function ($q, $stateWrapper, Player) {

    var defer = $q.defer();

    var battle = '';
    var socketRef = null;

    var update = function update(newBattle) {

        if (battle) {
            battle.actionChannel.unsubscribe();
            battle.actionChannel.unwatch();
            battle.resultsChannel.unsubscribe();
            battle.resultsChannel.unwatch();
            socketRef.unsubscribe('battle:' + battle._id + ':actions');
            socketRef.unsubscribe('battle:' + battle._id + ':results');

            if (!newBattle) {
                battle.actionChannel.destroy();
                battle.resultsChannel.destroy();

                // when the battle is over, reset the defer
                defer.resolve();
                defer = $q.defer();
            }
        }

        battle = newBattle;

        if (newBattle) {
            var myName = Player.get().name;
            var me = _.find(battle.playerData, { name: myName });
            Player.set(me);

            $stateWrapper.noGoingBack('battle');
            battle.actionChannel = socketRef.subscribe('battle:' + battle._id + ':actions');
            battle.resultsChannel = socketRef.subscribe('battle:' + battle._id + ':results');
        }

        defer.notify(battle);
    };

    return {
        observer: function observer() {
            return defer.promise;
        },
        apply: function apply() {
            defer.notify(battle);
        },
        setSocket: function setSocket(socket) {
            return socketRef = socket;
        },
        set: update,
        get: function get() {
            return battle;
        }
    };
}]);
'use strict';

angular.module('retro').service('Monsters', ["$q", function ($q) {

    var defer = $q.defer();

    var monsters = [];

    var updateMonsters = function updateMonsters(newMonsters) {
        monsters = newMonsters;
        defer.notify(monsters);
    };

    return {
        observer: defer.promise,
        apply: function apply() {
            defer.notify(monsters);
        },
        set: updateMonsters,
        get: function get() {
            return monsters;
        }
    };
}]);
'use strict';

angular.module('retro').service('Places', ["$q", function ($q) {

    var defer = $q.defer();

    var places = [];

    var updatePlaces = function updatePlaces(newPlaces) {
        places = newPlaces;
        defer.notify(places);
    };

    return {
        observer: defer.promise,
        apply: function apply() {
            defer.notify(places);
        },
        set: updatePlaces,
        get: function get() {
            return places;
        }
    };
}]);
'use strict';

angular.module('retro').service('Player', ["$q", function ($q) {
    var defer = $q.defer();

    var player = {};

    var updatePlayer = function updatePlayer(newPlayer) {
        player = newPlayer;
        defer.notify(player);
    };

    return {
        observer: defer.promise,
        apply: function apply() {
            defer.notify(player);
        },
        set: updatePlayer,
        get: function get() {
            return player;
        }
    };
}]);
'use strict';

angular.module('retro').service('Skills', ["$q", function ($q) {

    var defer = $q.defer();

    var skills = [];

    var getNewSkills = function getNewSkills(newSkills) {
        skills = newSkills;
        defer.notify(skills);
    };

    return {
        observer: defer.promise,
        set: getNewSkills,
        get: function get() {
            return skills;
        }
    };
}]);
'use strict';

angular.module('retro').service('AuthFlow', ["$q", "AuthData", "Toaster", "$localStorage", "$state", "$stateWrapper", "Player", "Settings", "LocationWatcher", "Config", "socket", function ($q, AuthData, Toaster, $localStorage, $state, $stateWrapper, Player, Settings, LocationWatcher, Config, socket) {
    var flow = {
        toPlayer: function toPlayer() {
            if (!_.contains(['home', 'create'], $state.current.name)) return;

            $stateWrapper.noGoingBack('player');
        },
        tryAutoLogin: function tryAutoLogin() {
            if (!$localStorage.profile || !$localStorage.profile.user_id) {
                AuthData.update({ attemptAutoLogin: false });
                return;
            }
            flow.login(_.clone($localStorage), true);
        },
        tryAuth: function tryAuth() {
            var fail = function fail(val) {
                if (!val) return;
                $stateWrapper.go('create');
            };

            if ($localStorage.profile.user_id) {
                flow.login(_.clone($localStorage), true).then(null, fail);

                // only fail to the char create screen if there's a server connection
            } else if (AuthData.get().canConnect) {
                    fail();
                }
        },
        login: function login(NewHeroProto) {
            var swallow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var defer = $q.defer();

            var NewHero = {
                name: NewHeroProto.name,
                profession: NewHeroProto.profession,
                userId: NewHeroProto.profile.user_id,
                token: NewHeroProto.token
            };

            var currentLocation = LocationWatcher.current();
            if (!currentLocation) {
                defer.reject(false);
                return defer.promise;
            }

            NewHero.homepoint = { lat: currentLocation.latitude, lon: currentLocation.longitude };

            socket.emit('login', NewHero, function (err, success) {
                if (err) {
                    defer.reject(true);
                } else {
                    defer.resolve();
                    _.extend(Settings, success.settings);
                    flow.toPlayer();
                    flow.isLoggedIn = true;
                    $localStorage.env = Config._cfg;
                }

                if (!swallow) {
                    var msgObj = err ? err : success;
                    Toaster.show(msgObj.msg);
                }
            });

            Settings.isReady = defer.promise;
            return Settings.isReady;
        }
    };

    return flow;
}]);
'use strict';

angular.module('retro').service('BattleFlow', ["Player", "Battle", "Toaster", "$stateWrapper", "socket", function (Player, Battle, Toaster, $stateWrapper, socket) {

    var start = function start(monster) {
        socket.emit('combat:enter', { name: Player.get().name, monsters: [monster] }, Toaster.handleDefault());
    };

    var confirmAction = function confirmAction(_ref) {
        var origin = _ref.origin;
        var id = _ref.id;
        var skill = _ref.skill;

        socket.emit('combat:confirmaction', { skill: skill, target: id, name: origin }, Toaster.handleDefault());
    };

    var toExplore = function toExplore() {
        $stateWrapper.noGoingBack('explore');
    };

    return {
        start: start,
        confirmAction: confirmAction,
        toExplore: toExplore
    };
}]);
'use strict';

angular.module('retro').service('ClassChangeFlow', ["Toaster", "$stateWrapper", "Player", "socket", function (Toaster, $stateWrapper, Player, socket) {
    return {
        change: function change(newProfession) {

            var player = Player.get();

            var opts = { name: player.name, newProfession: newProfession };
            socket.emit('player:change:class', opts, Toaster.handleDefault(function () {
                return $stateWrapper.go('player');
            }));
        }
    };
}]);
'use strict';

angular.module('retro').service('EquipFlow', ["Toaster", "$stateWrapper", "Player", "socket", function (Toaster, $stateWrapper, Player, socket) {
    return {
        equip: function equip(newItem) {

            var player = Player.get();

            var opts = { name: player.name, itemId: newItem.itemId };
            socket.emit('player:change:equipment', opts, Toaster.handleDefault(function () {
                return $stateWrapper.go('player');
            }));
        }
    };
}]);
'use strict';

angular.module('retro').service('SkillChangeFlow', ["Toaster", "$state", "Player", "socket", function (Toaster, $state, Player, socket) {
    return {
        change: function change(skill, slot) {

            var player = Player.get();

            var opts = { name: player.name, skillName: skill, skillSlot: slot };
            socket.emit('player:change:skill', opts, Toaster.handleDefault());
        }
    };
}]);
'use strict';

angular.module('retro').service('Dice', ["$window", function ($window) {
    return $window.dice;
}]);
'use strict';

angular.module('retro').service('Google', function () {
    return window.google;
});
'use strict';

angular.module('retro').service('socketCluster', ["$window", function ($window) {
    return $window.socketCluster;
}]).service('socket', ["AuthData", "$stateWrapper", "Config", "Toaster", "socketCluster", "socketManagement", function (AuthData, $stateWrapper, Config, Toaster, socketCluster, socketManagement) {
    AuthData.update({ canConnect: true });

    var socket = socketCluster.connect({
        protocol: Config[Config._cfg].protocol,
        hostname: Config[Config._cfg].url,
        port: Config[Config._cfg].port
    });

    var codes = {
        1006: 'Unable to connect to game server.'
    };

    socket.on('error', function (e) {
        if (!codes[e.code]) return;
        if (e.code === 1006) {
            AuthData.update({ canConnect: false, attemptAutoLogin: false });
        }
        Toaster.show(codes[e.code]);
    });

    socket.on('connect', function () {
        AuthData.update({ canConnect: true, attemptAutoLogin: true });
    });

    socket.on('disconnect', function () {
        $stateWrapper.noGoingBack('home');
    });

    socketManagement.setUpEvents(socket);

    return socket;
}]).service('socketManagement', ["Player", "Skills", "Places", "Monsters", "Battle", function (Player, Skills, Places, Monsters, Battle) {
    return {
        setUpEvents: function setUpEvents(socket) {
            socket.on('update:player', Player.set);
            socket.on('update:skills', Skills.set);
            socket.on('update:places', Places.set);
            socket.on('update:monsters', Monsters.set);
            socket.on('combat:entered', Battle.set);

            Battle.setSocket(socket);
        }
    };
}]);
'use strict';

angular.module('retro').service('$stateWrapper', ["$state", "$ionicHistory", function ($state, $ionicHistory) {
    return {
        go: $state.go,
        noGoingBackAndNoCache: function noGoingBackAndNoCache(state) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go(state, { timestamp: Date.now() });
        },
        goBreakCache: function goBreakCache(state) {
            $state.go(state, { timestamp: Date.now() });
        },
        noGoingBack: function noGoingBack(state) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go(state);
        }
    };
}]);