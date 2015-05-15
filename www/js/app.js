"use strict";

angular.module("retro", ["ionic", "ngCordova", "ngCordovaOauth"]).run(["$ionicPlatform", function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
        $scope.$root.hideMenu = toState.name === "home";
    });
}]).controller("HomeController", ["$scope", "$state", "$ionicPlatform", "$ionicHistory", "$cordovaOauth", "OAUTH_KEYS", function ($scope, $state, $ionicPlatform, $ionicHistory, $cordovaOauth, OAUTH_KEYS) {

    $scope.skipAuth = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("player");
    };

    $scope.auth = {
        google: function () {
            $cordovaOauth.google(OAUTH_KEYS.google, ["email"]).then(function (result) {
                window.alert("Response Object -> " + JSON.stringify(result));
            }, function (error) {
                window.alert("Error -> " + error);
            });
        }
    };

    $ionicPlatform.ready(function () {});
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
    google: "195531055167-99jquaolc9p50656qqve3q913204pmnp.apps.googleusercontent.com"
});