"use strict";

angular.module("retro", ["ionic", "ngCordova", "ngCordovaOauth", "ngStorage"]).run(["$ionicPlatform", function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}]).config(["$ionicConfigProvider", "$urlRouterProvider", "$stateProvider", function ($ionicConfigProvider, $urlRouterProvider, $stateProvider) {

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
}]).service("socketCluster", ["$window", function ($window) {
    return $window.socketCluster;
}]).service("socket", ["socketCluster", function (socketCluster) {
    return socketCluster.connect({ hostname: "192.168.1.11", port: 8000 });
}]).directive("colorText", function () {
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
}).service("NewHero", function () {
    return {
        profession: "Fighter"
    };
}).service("Player", function () {
    var clamp = function (min, cur, max) {
        return Math.max(min, Math.min(max, cur));
    };

    var player = {
        name: "Seiyria",
        unlockedProfessions: ["Cleric", "Fighter", "Mage"],
        professionLevels: {
            Fighter: {
                level: 1
            }
        },
        stats: {
            profession: "Fighter",
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
            },
            item: {
                type: "item",
                name: "Health Potion"
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
}).controller("MenuController", ["$scope", "$state", function ($scope, $state) {
    $scope.menu = [{ icon: "ion-person", name: "Player", state: "player" }, { icon: "ion-earth", name: "Explore", state: "explore" }, { icon: "ion-briefcase", name: "Inventory", state: "inventory" }, { icon: "ion-gear-b", name: "Options", state: "options" }];

    $scope.travel = function (state) {
        $state.go(state);
    };

    $scope.$root.$on("$stateChangeSuccess", function (event, toState) {
        $scope.$root.hideMenu = toState.name === "home" || toState.name === "create";
    });
}]).controller("HomeController", ["$scope", "$http", "$state", "$localStorage", "$ionicHistory", "$cordovaOauth", "NewHero", "OAUTH_KEYS", function ($scope, $http, $state, $localStorage, $ionicHistory, $cordovaOauth, NewHero, OAUTH_KEYS) {

    $scope.skipAuth = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("player");
    };

    $scope.auth = {
        /*google: {
            creds: () => {
                $cordovaOauth.google(OAUTH_KEYS.google, ['email']).then(function(result) {
                    window.alert("Response Object -> " + JSON.stringify(result));
                    $scope.auth.google.login();
                }, function(error) {
                    window.alert("Error -> " + error);
                });
            },
            login: () => {
             }
        },*/
        /*reddit: () => {
            $cordovaOauth.reddit(OAUTH_KEYS.reddit, 'code', ['identity']).then((result) => {
                window.alert('response ' + JSON.stringify(result));
            }, (error) => {
                window.alert('error ' + error);
            });
        },*/
        facebook: {
            creds: function () {
                if ($localStorage.facebookToken) {
                    $scope.auth.facebook.login();
                    return;
                }

                $cordovaOauth.facebook(OAUTH_KEYS.facebook, ["email"]).then(function (result) {
                    $localStorage.facebookToken = result.access_token;
                    $scope.auth.facebook.login();
                }, function (error) {
                    window.alert("error " + error);
                });
            },
            login: function () {
                $http.get("https://graph.facebook.com/me?fields=id&access_token=" + $localStorage.facebookToken).then(function (res) {
                    NewHero.facebookId = $localStorage.facebookId = res.data.id;
                    $scope.tryAuth();
                });
            }
        }
    };

    $scope.tryAuth = function () {
        $state.go("create");
    };
}]).controller("CreateCharacterController", ["$scope", "NewHero", "CLASSES", "socket", function ($scope, NewHero, CLASSES, socket) {
    $scope.NewHero = NewHero;
    $scope.baseProfessions = ["Cleric", "Mage", "Fighter"];
    $scope.CLASSES = CLASSES;

    $scope.create = function () {
        window.alert("socket", socket);
        //console.log(socket.getState());
        socket.emit("login", NewHero);
    };
}]).controller("PlayerController", ["$scope", "Player", function ($scope, Player) {
    $scope.player = Player;
}]).controller("ClassChangeController", ["$scope", "Player", "CLASSES", function ($scope, Player, CLASSES) {
    $scope.player = Player;
    $scope.CLASSES = CLASSES;
}]).controller("InventoryController", ["$scope", "Player", function ($scope, Player) {
    $scope.player = Player;
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