"use strict";

angular.module("retro", ["ionic", "ngCordova", "ngStorage", "auth0", "angular-jwt"]);
"use strict";

angular.module("retro").constant("Config", {
    _cfg: "DEV",
    DEV: {
        url: "192.168.1.7",
        port: 8080
    },
    PROD: {
        protocol: "https",
        url: "reactive-retro.herokuapp.com",
        port: 80
    }
});
"use strict";

angular.module("retro").config(["authProvider", function (authProvider) {
    authProvider.init({
        domain: "reactive-retro.auth0.com",
        clientID: "ucMSnNDYLGdDBL2uppganZv2jKzzJiI0",
        loginState: "home"
    });
}]).run(["auth", "$localStorage", "$rootScope", "$state", "jwtHelper", "AuthFlow", "Config", function (auth, $localStorage, $rootScope, $state, jwtHelper, AuthFlow, Config) {
    auth.hookEvents();

    if (Config._cfg !== $localStorage.env) {
        $localStorage.profile = $localStorage.token = $localStorage.refreshingToken = null;
        return;
    }

    var autologin = function () {
        if (!auth.isAuthenticated || !$localStorage.profile || !$localStorage.profile.user_id) {
            return;
        } // jshint ignore:line

        $rootScope.attemptAutoLogin = true;
        AuthFlow.login(_.clone($localStorage), true);
    };

    var refreshingToken = null;
    $rootScope.$on("$locationChangeStart", function (e, n, c) {
        // if you route to the same state and aren't logged in, don't do this event
        // it causes the login events on the server to fire twice
        if (n === c) {
            return;
        }
        if (AuthFlow.isLoggedIn) {
            return;
        }

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
        } else {
            if (refreshToken) {
                if (refreshingToken === null) {
                    refreshingToken = auth.refreshIdToken(refreshToken).then(function (idToken) {
                        $localStorage.token = idToken;
                        auth.authenticate(profile, idToken);
                        autologin();
                    })["finally"](function () {
                        refreshingToken = null;
                    });
                }
                return refreshingToken;
            } else {
                $state.go("home");
            }
        }
    });
}]);
"use strict";

angular.module("retro").run(["$rootScope", "$ionicPlatform", function ($rootScope, $ionicPlatform) {

    $rootScope.$on("$stateChangeSuccess", function (event, toState) {
        $rootScope.hideMenu = toState.name === "home" || toState.name === "create";
    });

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
        controller: "CreateCharacterController",
        data: { requiresLogin: true }
    }).state("player", {
        url: "/player",
        templateUrl: "player",
        controller: "PlayerController",
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("changeclass", {
        url: "/changeclass",
        templateUrl: "changeclass",
        controller: "ClassChangeController",
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("changeskills", {
        url: "/changeskills",
        templateUrl: "changeskills",
        controller: "SkillChangeController",
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("inventory", {
        url: "/inventory",
        templateUrl: "inventory",
        controller: "InventoryController",
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("inventory.armor", {
        url: "/armor",
        views: {
            "armor-tab": {
                templateUrl: "inventory-tab-armor"
            }
        },
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("inventory.weapons", {
        url: "/weapons",
        views: {
            "weapons-tab": {
                templateUrl: "inventory-tab-weapons"
            }
        },
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("inventory.items", {
        url: "/items",
        views: {
            "items-tab": {
                templateUrl: "inventory-tab-items"
            }
        },
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("options", {
        url: "/options",
        templateUrl: "options",
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    }).state("explore", {
        url: "/explore",
        templateUrl: "explore",
        controller: "ExploreController",
        data: { requiresLogin: true },
        resolve: {
            playerLoaded: ["$injector", function ($injector) {
                return $injector.get("Settings").isReady;
            }]
        }
    });
}]);
"use strict";

angular.module("retro").constant("CLASSES", {
    Cleric: "Clerics specialize in healing their companions.",
    Fighter: "Fighters specialize in making their enemies hurt via physical means.",
    Mage: "Mages specialize in flinging magic at their enemies -- sometimes multiple at once!",
    Thief: "Thieves specialize in quick attacks and physical debuffing."
});
"use strict";

angular.module("retro").constant("OAUTH_KEYS", {
    google: "195531055167-99jquaolc9p50656qqve3q913204pmnp.apps.googleusercontent.com",
    reddit: "CKzP2LKr74VwYw",
    facebook: "102489756752863"
});
"use strict";

angular.module("retro").constant("MAP_COLORS", {
    monster: {
        outline: "#ff0000",
        fill: "#aa0000"
    },
    poi: {
        outline: "#ffff00",
        fill: "#aaaa00"
    },
    homepoint: {
        outline: "#00ff00",
        fill: "#00aa00"
    },
    miasma: {
        outline: "#000000",
        fill: "#000000"
    },
    hero: {
        outline: "#0000ff",
        fill: "#0000aa"
    },
    heroRadius: {
        outline: "#ff00ff",
        fill: "#ff00ff"
    }
});
"use strict";

angular.module("retro").constant("MAP_STYLE", [{
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#aee2e0" }]
}, {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#abce83" }]
}, {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
}, {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ visibility: "simplified" }, { color: "#8dab68" }]
}, {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ visibility: "simplified" }]
}, {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5B5B3F" }]
}, {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ABCE83" }]
}, {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
}, {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#A4C67D" }]
}, {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#9BBF72" }]
}, {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#EBF4A4" }]
}, {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
}, {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ visibility: "on" }, { color: "#87ae79" }]
}, {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{ color: "#7f2200" }, { visibility: "off" }]
}, {
    featureType: "administrative",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }, { visibility: "on" }, { weight: 4.1 }]
}, {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#495421" }]
}, {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
}, {
    featureType: "administrative.land_parcel",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
}, {
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
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
    $scope.baseProfessions = ["Thief", "Mage", "Fighter"];

    $scope.create = function () {
        var hero = _.merge(NewHero, $localStorage);
        AuthFlow.login(hero);
    };
}]);
"use strict";

angular.module("retro").controller("ExploreController", ["$scope", "$ionicLoading", "Player", "LocationWatcher", "Google", "Settings", "MapDrawing", function ($scope, $ionicLoading, Player, LocationWatcher, Google, Settings, MapDrawing) {

    $scope.currentlySelected = null;
    $scope.centered = true;

    var unCenter = function () {
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
        MapDrawing.drawPlaces(map, Settings.places);
        MapDrawing.drawMonsters(map, Settings.monsters, $scope.select);
        MapDrawing.addMapEvents(map, unCenter);
    };

    $scope.centerOnMe = function () {
        $scope.findMe();
        $scope.centered = true;
    };

    var _setSelected = function (opts) {
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
        var centerMap = arguments[1] === undefined ? false : arguments[1];

        if (!$scope.map) {
            return;
        }
        if (!coords.latitude || !coords.longitude) {
            return;
        }
        var position = new Google.maps.LatLng(coords.latitude, coords.longitude);

        if (centerMap) {
            $scope.map.setCenter(position);
        }

        MapDrawing.setCurrentPosition(position);
    };
}]);
"use strict";

angular.module("retro").controller("HomeController", ["$scope", "LocationWatcher", "Auth", function ($scope, LocationWatcher, Auth) {
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

angular.module("retro").controller("MenuController", ["$scope", "$state", "$ionicPopup", "Auth", function ($scope, $state, $ionicPopup, Auth) {

    var logoutCheck = function () {
        $ionicPopup.confirm({
            title: "Log out?",
            template: "Are you sure you want to log out?"
        }).then(function (res) {
            if (!res) {
                return;
            }
            Auth.logout();
        });
    };

    $scope.stateHref = $state.href;

    $scope.menu = [{ icon: "ion-person", name: "Player", state: "player" }, { icon: "ion-earth", name: "Explore", state: "explore" }, { icon: "ion-briefcase", name: "Inventory", state: "inventory" }, { icon: "ion-university", name: "Skills", state: "changeskills" }, { icon: "ion-gear-b", name: "Options", state: "options" }, { icon: "ion-android-exit", name: "Logout", call: logoutCheck }];

    $scope.travel = function (state) {
        return $state.go(state, { timestamp: Date.now() });
    };
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

angular.module("retro").controller("SkillChangeController", ["$scope", "$ionicModal", "Player", "Skills", "SkillChangeFlow", "Dice", function ($scope, $ionicModal, Player, Skills, SkillChangeFlow, Dice) {
    $scope.player = Player.get();

    var getAllSkills = function (baseSkills) {
        return _(baseSkills).each(function (skill) {
            return skill.spellLevel = skill.spellClasses[_.keys(skill.spellClasses)[0]];
        }).sortBy(["spellLevel", "spellName"]).groupBy(function (skill) {
            return _.keys(skill.spellClasses)[0];
        }).value();
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
            return obj.name === "Damage" ? "*" : obj.name;
        }).value();

        $scope.modal.show();
    };

    $scope.countNumTimesSkillSet = function (skillName) {
        return _.filter(Skills.get(), function (skill) {
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

    $ionicModal.fromTemplateUrl("changeskill.info", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // clean up modal b/c memory
    $scope.$on("$destroy", function () {
        $scope.modal.remove();
    });

    Player.observer.then(null, null, function (player) {
        return $scope.player = player;
    });
    Skills.observer.then(null, null, function (skills) {
        return $scope.allSkills = getAllSkills(skills);
    });
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

angular.module("retro").directive("map", ["MAP_STYLE", "Toaster", "Google", function (MAP_STYLE, Toaster, Google) {
    return {
        restrict: "E",
        scope: {
            onCreate: "&",
            onClick: "&"
        },
        link: function ($scope, $element) {

            if (!Google || !Google.maps) {
                Toaster.show("Could not reach google.");
                return;
            }

            // this is the available list of places in the game
            var init = function () {
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

                Google.maps.event.addDomListener($element[0], "mousedown", function (e) {
                    $scope.onClick();
                    e.preventDefault();
                    return false;
                });
            };

            if (document.readyState === "complete") {
                init();
            } else {
                Google.maps.event.addDomListener(window, "load", init);
            }
        }
    };
}]);
"use strict";

angular.module("retro").service("Auth", ["$localStorage", "$state", "$ionicHistory", "auth", "AuthFlow", function ($localStorage, $state, $ionicHistory, auth, AuthFlow) {

    var localAuth = {
        login: function () {
            auth.signin({
                authParams: {
                    scope: "openid offline_access email",
                    device: "Mobile device"
                }
            }, function (profile, token, accessToken, state, refreshToken) {
                $localStorage.profile = profile;
                $localStorage.token = token;
                $localStorage.refreshToken = refreshToken;

                AuthFlow.tryAuth();
            }, function (err) {
                console.log("failed", JSON.stringify(err));
            });
        },
        logout: function () {
            auth.signout();
            $localStorage.profile = null;
            $localStorage.token = null;

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go("home");
        }
    };

    return localAuth;
}]);
"use strict";

angular.module("retro").service("AuthFlow", ["$q", "$rootScope", "$ionicHistory", "Toaster", "$localStorage", "$state", "Player", "Settings", "LocationWatcher", "Config", "socket", function ($q, $rootScope, $ionicHistory, Toaster, $localStorage, $state, Player, Settings, LocationWatcher, Config, socket) {
    var flow = {
        toPlayer: function () {
            if (!_.contains(["home", "create"], $state.current.name)) {
                return;
            }

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("player");
        },
        tryAuth: function () {
            var fail = function () {
                return $state.go("create");
            };

            if ($localStorage.profile.user_id) {
                // jshint ignore:line
                flow.login(_.clone($localStorage), true).then(null, fail);

                //only fail to the char create screen if there's a server connection
            } else if ($rootScope.canConnect) {
                fail();
            }
        },
        login: function (NewHeroProto) {
            var swallow = arguments[1] === undefined ? false : arguments[1];

            var defer = $q.defer();

            var NewHero = {
                name: NewHeroProto.name,
                profession: NewHeroProto.profession,
                userId: NewHeroProto.profile.user_id, //jshint ignore:line
                token: NewHeroProto.token
            };

            var currentLocation = LocationWatcher.current();
            if (!currentLocation) {
                $rootScope.attemptAutoLogin = false;
                return Toaster.show("No current location. Is your GPS on?");
            }

            NewHero.homepoint = { lat: currentLocation.latitude, lon: currentLocation.longitude };

            socket.emit("login", NewHero, function (err, success) {
                if (err) {
                    defer.reject();
                } else {
                    defer.resolve();
                    Player.set(success.player);
                    _.extend(Settings, success.settings);
                    Settings.places = success.places;
                    Settings.monsters = success.monsters;
                    flow.toPlayer();
                    flow.isLoggedIn = true;
                    $localStorage.env = Config._cfg;
                }

                $rootScope.attemptAutoLogin = false;

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
"use strict";

angular.module("retro").service("ClassChangeFlow", ["Toaster", "$state", "Player", "socket", function (Toaster, $state, Player, socket) {
    return {
        change: function (newProfession) {

            var player = Player.get();

            var opts = { name: player.name, newProfession: newProfession };
            socket.emit("classchange", opts, function (err, success) {
                var msgObj = err ? err : success;
                Toaster.show(msgObj.msg);

                if (success) {
                    Player.set(success.player);
                    $state.go("player");
                }
            });
        }
    };
}]);
"use strict";

angular.module("retro").service("Dice", ["$window", function ($window) {
    return $window.dice;
}]);
"use strict";

angular.module("retro").service("EquipFlow", ["Toaster", "$state", "Player", "socket", function (Toaster, $state, Player, socket) {
    return {
        equip: function (newItem) {

            var player = Player.get();

            var opts = { name: player.name, itemId: newItem.itemId };
            socket.emit("equip", opts, function (err, success) {
                var msgObj = err ? err : success;
                Toaster.show(msgObj.msg);

                if (success) {
                    Player.set(success.player);
                    $state.go("player");
                }
            });
        }
    };
}]);
"use strict";

angular.module("retro").service("Google", function () {
    return window.google;
});
"use strict";

angular.module("retro").service("LocationWatcher", ["$q", function ($q) {

    var defer = $q.defer();
    var ready = $q.defer();

    var error = function () {
        console.log("GPS turned off, or connection errored.");
    };

    var currentCoords = {};

    var watcher = {
        current: function () {
            return currentCoords;
        },
        start: function () {
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
"use strict";

angular.module("retro").service("MapDrawing", ["Google", "Settings", "MAP_COLORS", function (Google, Settings, MAP_COLORS) {

    var savedPlaces = [];
    var savedMonsters = [];
    var curPos = {};
    var homepoint = {};
    var miasma = {};

    var MAX_VIEW_RADIUS = Settings.RADIUS; //meters

    var bounds = new Google.maps.LatLngBounds();

    var mercatorWorldBounds = [new Google.maps.LatLng(85, 180), new Google.maps.LatLng(85, 90), new Google.maps.LatLng(85, 0), new Google.maps.LatLng(85, -90), new Google.maps.LatLng(85, -180), new Google.maps.LatLng(0, -180), new Google.maps.LatLng(-85, -180), new Google.maps.LatLng(-85, -90), new Google.maps.LatLng(-85, 0), new Google.maps.LatLng(-85, 90), new Google.maps.LatLng(-85, 180), new Google.maps.LatLng(0, 180), new Google.maps.LatLng(85, 180)];

    // radius in meters
    var drawCircle = function (point, radius) {
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

    var drawPlaces = function (map, places) {
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

    var drawMonsters = function (map, monsters) {
        var click = arguments[2] === undefined ? function () {} : arguments[2];

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

            monsterMarker.addListener("click", function () {

                var infoWindow = new Google.maps.InfoWindow({
                    content: monster.name
                });

                infoWindow.open(map, monsterMarker);

                click({ monster: monster, infoWindow: infoWindow });
            });

            savedMonsters.push(monsterMarker);
        });
    };

    var drawHomepoint = function (map, coords) {
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
    };

    var drawMe = function (map, coords) {
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

        affectRadius.bindTo("center", curPos, "position");
    };

    var addMapEvents = function (map) {
        var dragCallback = arguments[1] === undefined ? function () {} : arguments[1];

        var lastValidCenter = null;

        Google.maps.event.addListener(map, "drag", dragCallback);

        Google.maps.event.addListener(map, "center_changed", function () {
            if (bounds.contains(map.getCenter())) {
                lastValidCenter = map.getCenter();
                return;
            }

            map.panTo(lastValidCenter);
        });
    };

    var setCurrentPosition = function (pos) {
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
"use strict";

angular.module("retro").service("NewHero", function () {
    return {
        profession: "Fighter"
    };
});
"use strict";

angular.module("retro").service("Player", ["$q", "Skills", function ($q, Skills) {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    var defer = $q.defer();

    var player = {};

    var oldProfession = "";

    var updatePlayer = function (newPlayer) {
        player = newPlayer;
        defer.notify(player);
    };

    return {
        observer: defer.promise,
        apply: function () {
            defer.notify(player);
        },
        set: function (newPlayer) {
            updatePlayer(newPlayer);

            if (oldProfession !== newPlayer.profession) {
                Skills.update(newPlayer);
            }
        },
        get: function () {
            return player;
        }
    };
}]);
"use strict";

angular.module("retro").service("Settings", function () {});
"use strict";

angular.module("retro").service("SkillChangeFlow", ["Toaster", "$state", "Player", "socket", function (Toaster, $state, Player, socket) {
    return {
        change: function (skill, slot) {

            var player = Player.get();

            var opts = { name: player.name, skillName: skill, skillSlot: slot };
            socket.emit("skillchange", opts, function (err, success) {
                var msgObj = err ? err : success;
                Toaster.show(msgObj.msg);

                if (success) {
                    Player.set(success.player);
                }
            });
        }
    };
}]);
"use strict";

angular.module("retro").service("Skills", ["$q", "socket", function ($q, socket) {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    var defer = $q.defer();

    var skills = [];

    var getNewSkills = function (player) {
        socket.emit("getskills", { name: player.name }, function (err, res) {
            skills = res && res.skills ? res.skills : [];
            defer.notify(skills);
        });
    };

    return {
        observer: defer.promise,
        update: getNewSkills,
        get: function () {
            return skills;
        }
    };
}]);
"use strict";

angular.module("retro").service("socketCluster", ["$window", function ($window) {
    return $window.socketCluster;
}]).service("socket", ["$rootScope", "Config", "Toaster", "socketCluster", function ($rootScope, Config, Toaster, socketCluster) {
    $rootScope.canConnect = true;

    var socket = socketCluster.connect({
        protocol: Config[Config._cfg].protocol,
        hostname: Config[Config._cfg].url,
        port: Config[Config._cfg].port
    });

    var codes = {
        1006: "Unable to connect to game server."
    };

    socket.on("error", function (e) {
        if (!codes[e.code]) {
            return;
        }
        if (e.code === 1006) {
            $rootScope.canConnect = false;
        }
        Toaster.show(codes[e.code]);
    });

    socket.on("connect", function () {
        $rootScope.canConnect = true;
    });

    return socket;
}]);
"use strict";

angular.module("retro").service("Toaster", ["$cordovaToast", function ($cordovaToast) {
    return {
        show: function (msg) {
            try {
                $cordovaToast.showLongBottom(msg);
            } catch (e) {
                console.log(msg);
            }
        }
    };
}]);