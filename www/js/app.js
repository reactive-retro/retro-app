"use strict";

angular.module("retro", ["ionic", "ngCordova", "ngCordovaOauth", "ngStorage"]);
"use strict";

angular.module("retro").constant("DEV_CFG", {
    url: "127.0.0.1",
    port: 8080
});
"use strict";

angular.module("retro").run(["$ionicPlatform", function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            window.StatusBar.styleDefault();
        }
    });
}]);
"use strict";

angular.module("retro").config(["$ionicConfigProvider", "$urlRouterProvider", "$stateProvider", function ($ionicConfigProvider, $urlRouterProvider, $stateProvider) {

    $ionicConfigProvider.views.swipeBackEnabled(false);

    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "index",
        controller: "HomeController"
    }).state("create", {
        url: "/create",
        templateUrl: "createchar",
        controller: "CreateCharacterController"
    }).state("player", {
        url: "/player",
        templateUrl: "player",
        controller: "PlayerController"
    }).state("changeclass", {
        url: "/changeclass",
        templateUrl: "changeclass",
        controller: "ClassChangeController"
    }).state("inventory", {
        url: "/inventory",
        templateUrl: "inventory",
        controller: "InventoryController"
    }).state("inventory.armor", {
        url: "/armor",
        views: {
            "armor-tab": {
                templateUrl: "inventory-tab-armor"
            }
        }
    }).state("inventory.weapons", {
        url: "/weapons",
        views: {
            "weapons-tab": {
                templateUrl: "inventory-tab-weapons"
            }
        }
    }).state("inventory.items", {
        url: "/items",
        views: {
            "items-tab": {
                templateUrl: "inventory-tab-items"
            }
        }
    }).state("options", {
        url: "/options",
        templateUrl: "options"
    }).state("explore", {
        url: "/explore",
        templateUrl: "explore",
        controller: "ExploreController"
    });
}]);
"use strict";

angular.module("retro").constant("CLASSES", {
    Cleric: "Clerics specialize in healing their companions.",
    Fighter: "Fighters specialize in making their enemies hurt via physical means.",
    Mage: "Mages specialize in flinging magic at their enemies -- sometimes multiple at once!"
});
"use strict";

angular.module("retro").constant("OAUTH_KEYS", {
    google: "195531055167-99jquaolc9p50656qqve3q913204pmnp.apps.googleusercontent.com",
    reddit: "CKzP2LKr74VwYw",
    facebook: "102489756752863"
});
"use strict";

angular.module("retro").constant("MAP_STYLE", [{
    featureType: "water",
    elementType: "geometry",
    stylers: [{
        visibility: "on"
    }, {
        color: "#aee2e0"
    }]
}, {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{
        color: "#abce83"
    }]
}, {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{
        color: "#769E72"
    }]
}, {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#7B8758"
    }]
}, {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [{
        color: "#EBF4A4"
    }]
}, {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{
        visibility: "simplified"
    }, {
        color: "#8dab68"
    }]
}, {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{
        visibility: "simplified"
    }]
}, {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#5B5B3F"
    }]
}, {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{
        color: "#ABCE83"
    }]
}, {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{
        visibility: "off"
    }]
}, {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{
        color: "#A4C67D"
    }]
}, {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{
        color: "#9BBF72"
    }]
}, {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{
        color: "#EBF4A4"
    }]
}, {
    featureType: "transit",
    stylers: [{
        visibility: "off"
    }]
}, {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{
        visibility: "on"
    }, {
        color: "#87ae79"
    }]
}, {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{
        color: "#7f2200"
    }, {
        visibility: "off"
    }]
}, {
    featureType: "administrative",
    elementType: "labels.text.stroke",
    stylers: [{
        color: "#ffffff"
    }, {
        visibility: "on"
    }, {
        weight: 4.1
    }]
}, {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{
        color: "#495421"
    }]
}, {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{
        visibility: "off"
    }]
}]);
"use strict";

angular.module("retro").controller("ClassChangeController", ["$scope", "Player", "CLASSES", "ClassChangeFlow", function ($scope, Player, CLASSES, ClassChangeFlow) {
    $scope.player = Player.get();
    $scope.CLASSES = CLASSES;
    $scope.ClassChangeFlow = ClassChangeFlow;

    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
}]);
"use strict";

angular.module("retro").controller("CreateCharacterController", ["$scope", "NewHero", "CLASSES", "AuthFlow", "$localStorage", function ($scope, NewHero, CLASSES, AuthFlow, $localStorage) {
    $scope.NewHero = NewHero;
    $scope.CLASSES = CLASSES;
    $scope.baseProfessions = ["Cleric", "Mage", "Fighter"];

    $scope.create = function () {
        var hero = _.merge(NewHero, $localStorage);
        AuthFlow.login(hero);
    };
}]);
"use strict";

angular.module("retro").controller("ExploreController", ["$scope", "$ionicLoading", "LocationWatcher", function ($scope, $ionicLoading, LocationWatcher) {

    // http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates

    $scope.mapCreated = function (map) {
        $scope.map = map;
        $scope.centerOn(LocationWatcher.current());
        $scope.findMe();
    };

    $scope.findMe = function () {
        LocationWatcher.watch.then(null, null, function (coords) {
            $scope.centerOn(coords);
        });
    };

    $scope.centerOn = function (coords) {
        if (!$scope.map) {
            return;
        }
        $scope.map.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
    };
}]);
"use strict";

angular.module("retro").controller("HomeController", ["$scope", "$http", "$state", "LocationWatcher", "Auth", function ($scope, $http, $state, LocationWatcher, Auth) {
    $scope.auth = Auth;
}]);
"use strict";

angular.module("retro").controller("InventoryController", ["$scope", "Player", "EquipFlow", function ($scope, Player, EquipFlow) {
    $scope.player = Player.get();
    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
    $scope.isEmpty = _.isEmpty;

    $scope.EquipFlow = EquipFlow;
}]);
"use strict";

angular.module("retro").controller("MenuController", ["$scope", "$state", function ($scope, $state) {
    $scope.menu = [{ icon: "ion-person", name: "Player", state: "player" }, { icon: "ion-earth", name: "Explore", state: "explore" }, { icon: "ion-briefcase", name: "Inventory", state: "inventory" }, { icon: "ion-gear-b", name: "Options", state: "options" }];

    $scope.travel = function (state) {
        $state.go(state);
    };

    $scope.$root.$on("$stateChangeSuccess", function (event, toState) {
        $scope.$root.hideMenu = toState.name === "home" || toState.name === "create";
    });
}]);
"use strict";

angular.module("retro").controller("PlayerController", ["$scope", "$state", "Player", function ($scope, $state, Player) {
    $scope.player = Player.get();
    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
    $scope.isEmpty = _.isEmpty;

    $scope.go = function (to) {
        $state.go(to);
    };
}]);
"use strict";

angular.module("retro").directive("colorText", function () {
    return {
        restrict: "E",
        template: "\n                <span ng-class=\"{assertive: value < 0, balanced: value > 0}\">{{preText}} {{value}}</span>\n            ",
        link: function (scope, elem, attrs) {
            scope.preText = attrs.preText;
            attrs.$observe("value", function (val) {
                return scope.value = val;
            });
        }
    };
});
"use strict";

angular.module("retro").directive("map", ["MAP_STYLE", function (MAP_STYLE) {
    return {
        restrict: "E",
        scope: {
            onCreate: "&"
        },
        link: function ($scope, $element) {
            var init = function () {
                var mapOptions = {
                    center: new google.maps.LatLng(32.3078, -64.7505),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    draggable: false,
                    minZoom: 13,
                    maxZoom: 19,
                    styles: MAP_STYLE,
                    mapTypeControlOptions: { mapTypeIds: [] },
                    overviewMapControl: false,
                    streetViewControl: false
                };

                var map = new google.maps.Map($element[0], mapOptions);

                $scope.onCreate({ map: map });

                google.maps.event.addDomListener($element[0], "mousedown", function (e) {
                    e.preventDefault();
                    return false;
                });
            };

            if (document.readyState === "complete") {
                init();
            } else {
                google.maps.event.addDomListener(window, "load", init);
            }
        }
    };
}]);
"use strict";

angular.module("retro").service("Auth", ["$http", "$localStorage", "$cordovaOauth", "OAUTH_KEYS", "NewHero", "AuthFlow", function ($http, $localStorage, $cordovaOauth, OAUTH_KEYS, NewHero, AuthFlow) {

    var auth = {
        _cleanup: function () {
            _.each(["facebookId"], function (key) {
                delete $localStorage[key];
                delete NewHero[key];
            });
        },
        facebook: {
            creds: function () {
                if ($localStorage.facebookToken) {
                    auth.facebook.login();
                    return;
                }

                $cordovaOauth.facebook(OAUTH_KEYS.facebook, ["email"]).then(function (result) {
                    $localStorage.facebookToken = result.access_token; //jshint ignore:line
                    auth.facebook.login();
                }, function (error) {
                    console.log("FACEBOOK", error);
                });
            },
            login: function () {
                var fail = function () {
                    $http.get("https://graph.facebook.com/me?fields=id&access_token=" + $localStorage.facebookToken).then(function (res) {
                        NewHero.facebookId = $localStorage.facebookId = res.data.id;
                        AuthFlow.tryAuth();
                    });
                };

                if ($localStorage.facebookId) {
                    AuthFlow.tryAuth();
                } else {
                    fail();
                }
            }
        }
    };

    return auth;
}]);
"use strict";

angular.module("retro").service("AuthFlow", ["$q", "$ionicHistory", "$cordovaToast", "$localStorage", "$state", "Player", "socket", function ($q, $ionicHistory, $cordovaToast, $localStorage, $state, Player, socket) {
    var flow = {
        toPlayer: function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("player");
        },
        tryAuth: function () {
            var fail = function () {
                return $state.go("create");
            };

            if ($localStorage.facebookId) {
                flow.login($localStorage, true).then(null, fail);
            } else {
                fail();
            }
        },
        login: function (NewHero) {
            var swallow = arguments[1] === undefined ? false : arguments[1];

            var defer = $q.defer();

            socket.emit("login", NewHero, function (err, success) {
                if (err) {
                    defer.reject();
                } else {
                    defer.resolve();
                    Player.set(success.player);
                    flow.toPlayer();
                }

                if (!swallow) {
                    var msgObj = err ? err : success;
                    $cordovaToast.showLongBottom(msgObj.msg);
                }
            });

            return defer.promise;
        }
    };
    return flow;
}]);
"use strict";

angular.module("retro").service("ClassChangeFlow", ["$cordovaToast", "$state", "Player", "socket", function ($cordovaToast, $state, Player, socket) {
    return {
        change: function (newProfession) {

            var player = Player.get();

            var opts = { name: player.name, newProfession: newProfession };
            socket.emit("classchange", opts, function (err, success) {
                var msgObj = err ? err : success;
                $cordovaToast.showLongBottom(msgObj.msg);

                if (success) {
                    Player.set(success.player);
                    $state.go("player");
                }
            });
        }
    };
}]);
"use strict";

angular.module("retro").service("EquipFlow", ["$cordovaToast", "$state", "Player", "socket", function ($cordovaToast, $state, Player, socket) {
    return {
        equip: function (newItem) {

            var player = Player.get();

            var opts = { name: player.name, itemId: newItem.itemId };
            socket.emit("equip", opts, function (err, success) {
                var msgObj = err ? err : success;
                $cordovaToast.showLongBottom(msgObj.msg);

                if (success) {
                    Player.set(success.player);
                    $state.go("player");
                }
            });
        }
    };
}]);
"use strict";

angular.module("retro").service("LocationWatcher", ["$q", function ($q) {

    var posOptions = { timeout: 30000, enableHighAccuracy: true };

    var defer = $q.defer();

    var error = function () {
        alert("Could not load GPS. Please check your settings.");
    };

    var currentCoords = {};

    var watcher = {
        current: function () {
            return currentCoords;
        },
        center: function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                currentCoords = position.coords;
                defer.notify(position.coords);
            }, error, posOptions);
        },

        watcher: function () {
            navigator.geolocation.watchPosition(function (position) {
                currentCoords = position.coords;
                defer.notify(position.coords);
            }, error);
        },

        watch: defer.promise
    };

    watcher.center();

    return watcher;
}]);
"use strict";

angular.module("retro").service("NewHero", function () {
    return {
        profession: "Fighter"
    };
});
"use strict";

angular.module("retro").service("Player", ["$q", function ($q) {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    var defer = $q.defer();

    var player = {
        name: "Seiyria",
        unlockedProfessions: ["Cleric", "Fighter", "Mage"],
        professionLevels: {
            Fighter: 1
        },
        profession: "Fighter",
        stats: {
            str: 10,
            agi: 10,
            int: 10,
            luk: 1,

            gold: 100,
            xp: {
                cur: 100,
                max: 1000
            },
            hp: {
                cur: 100,
                max: 1000
            },
            mp: {
                cur: 300,
                max: 500
            }
        },
        equipment: {
            weapon: {
                type: "weapon",
                name: "Knife",
                stats: {
                    str: 1,
                    int: -1
                }
            },
            armor: {
                type: "armor",
                name: "Shirt",
                weight: 1,
                stats: {
                    agi: 2
                }
            }
        },
        inventory: [{
            type: "weapon",
            name: "Dagger",
            stats: {
                str: 2
            }
        }, {
            type: "weapon",
            name: "Club",
            stats: {
                str: 3,
                agi: -1
            }
        }, {
            type: "weapon",
            name: "Staff",
            stats: {
                int: 2
            }
        }, {
            type: "weapon",
            name: "Main Gauche",
            stats: {
                str: 2,
                agi: 1
            }
        }, {
            type: "weapon",
            name: "Glaive",
            stats: {
                str: 2,
                agi: 4
            }
        }, {
            type: "armor",
            name: "Chainmail",
            weight: 2,
            stats: {
                agi: 3,
                str: 1
            }
        }, {
            type: "armor",
            name: "Fullplate",
            weight: 3,
            stats: {
                agi: -3,
                str: 4
            }
        }]
    };

    var functions = {
        calc: {
            stat: function (stat) {
                return _.reduce(player.equipment, function (prev, item) {
                    return prev + (item.stats[stat] || 0);
                }, 0);
            }
        }
    };

    return {
        observer: defer.promise,
        apply: function () {
            defer.notify(player);
        },
        set: function (newPlayer) {
            player = newPlayer;
            _.merge(player, functions);
            defer.notify(player);
        },
        get: function () {
            return player;
        }
    };
}]);
"use strict";

angular.module("retro").service("socketCluster", ["$window", function ($window) {
    return $window.socketCluster;
}]).service("socket", ["DEV_CFG", "socketCluster", function (DEV_CFG, socketCluster) {
    return socketCluster.connect({ hostname: DEV_CFG.url, port: DEV_CFG.port });
}]);