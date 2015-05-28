"use strict";

angular.module("retro", ["ionic", "ngCordova", "ngCordovaOauth", "ngStorage"]);
"use strict";

angular.module("retro").constant("DEV_CFG", {
    url: "localhost",
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
        templateUrl: "explore"
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

angular.module("retro").controller("ClassChangeController", ["$scope", "Player", "CLASSES", function ($scope, Player, CLASSES) {
    $scope.player = Player;
    $scope.CLASSES = CLASSES;
}]);
"use strict";

angular.module("retro").controller("CreateCharacterController", ["$scope", "NewHero", "CLASSES", "AuthFlow", function ($scope, NewHero, CLASSES, AuthFlow) {
    $scope.NewHero = NewHero;
    $scope.CLASSES = CLASSES;
    $scope.baseProfessions = ["Cleric", "Mage", "Fighter"];

    $scope.create = function () {
        AuthFlow.login(NewHero);
    };
}]);
"use strict";

angular.module("retro").controller("HomeController", ["$scope", "$http", "$state", "Auth", function ($scope, $http, $state, Auth) {
    $scope.auth = Auth;
}]);
"use strict";

angular.module("retro").controller("InventoryController", ["$scope", "Player", function ($scope, Player) {
    $scope.player = Player;
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

angular.module("retro").controller("PlayerController", ["$scope", "Player", function ($scope, Player) {
    $scope.player = Player;
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

angular.module("retro").service("Auth", ["$http", "$localStorage", "$cordovaOauth", "OAUTH_KEYS", "NewHero", "AuthFlow", function ($http, $localStorage, $cordovaOauth, OAUTH_KEYS, NewHero, AuthFlow) {

    $localStorage.facebookToken = 123;
    $localStorage.facebookId = 122;
    NewHero.facebookId = 122;

    var auth = {
        _cleanup: function () {
            _.each(["facebookId", function (key) {
                delete $localStorage[key];
                delete NewHero[key];
            }]);
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
                    window.alert("error " + error);
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

angular.module("retro").service("AuthFlow", ["$q", "$ionicHistory", "$cordovaToast", "$localStorage", "$state", "socket", function ($q, $ionicHistory, $cordovaToast, $localStorage, $state, socket) {
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
                flow.login($localStorage).then(null, fail);
            } else {
                fail();
            }
        },
        login: function (NewHero) {
            var defer = $q.defer();

            socket.emit("login", NewHero, function (err, success) {
                if (err) {
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
}]);
"use strict";

angular.module("retro").service("NewHero", function () {
    return {
        profession: "Fighter"
    };
});
"use strict";

angular.module("retro").service("Player", function () {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    var player = {
        name: "Seiyria",
        unlockedProfessions: ["Cleric", "Fighter", "Mage"],
        professionLevels: {
            Fighter: {
                level: 1
            }
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
            equip: function (item) {
                return undefined[item.type] = item;
            },
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

    return player;
});
"use strict";

angular.module("retro").service("socketCluster", ["$window", function ($window) {
    return $window.socketCluster;
}]).service("socket", ["DEV_CFG", "socketCluster", function (DEV_CFG, socketCluster) {
    return socketCluster.connect({ hostname: DEV_CFG.url, port: DEV_CFG.port });
}]);