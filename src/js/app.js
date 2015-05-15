angular.module('retro', ['ionic', 'ngCordova', 'ngCordovaOauth'])

    .run(['$ionicPlatform', ($ionicPlatform) => {
        $ionicPlatform.ready(() => {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }])

    .config(['$ionicConfigProvider', '$urlRouterProvider', '$stateProvider',
        ($ionicConfigProvider, $urlRouterProvider, $stateProvider) => {

            $ionicConfigProvider.views.swipeBackEnabled(false);

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'index',
                    controller: 'HomeController'
                })
                .state('player', {
                    url: '/player',
                    templateUrl: 'player',
                    controller: 'PlayerController'
                })
                .state('changeclass', {
                    url: '/changeclass',
                    templateUrl: 'changeclass',
                    controller: 'ClassChangeController'
                })
                .state('inventory', {
                    url: '/inventory',
                    templateUrl: 'inventory',
                    controller: 'InventoryController'
                })
                .state('inventory.armor', {
                    url: '/armor',
                    views: {
                        'armor-tab': {
                            templateUrl: 'inventory-tab-armor'
                        }
                    }
                })
                .state('inventory.weapons', {
                    url: '/weapons',
                    views: {
                        'weapons-tab': {
                            templateUrl: 'inventory-tab-weapons'
                        }
                    }
                })
                .state('inventory.items', {
                    url: '/items',
                    views: {
                        'items-tab': {
                            templateUrl: 'inventory-tab-items'
                        }
                    }
                })
                .state('options', {
                    url: '/options',
                    templateUrl: 'options'
                })
                .state('explore', {
                    url: '/explore',
                    templateUrl: 'explore'
                });
    }])

    .directive('colorText', () => {
        return {
            restrict: 'E',
            template: `
                <span ng-class="{assertive: value < 0, balanced: value > 0}">{{preText}} {{value}}</span>
            `,
            link: (scope, elem, attrs) => {
                scope.preText = attrs.preText;
                attrs.$observe('value', (val) => scope.value = val);
            }
        };
    })

    .service('Player', () => {
        var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

        var player = {
            name: 'Seiyria',
            unlockedProfessions: ['Cleric', 'Fighter', 'Mage'],
            professionLevels: {
                Fighter: {
                    level: 1
                }
            },
            stats: {
                profession: 'Fighter',
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
                equip: (item) => this[item.type] = item,
                weapon: {
                    type: 'weapon',
                    name: 'Knife',
                    stats: {
                        str: 1,
                        int: -1
                    }
                },
                armor: {
                    type: 'armor',
                    name: 'Shirt',
                    weight: 1,
                    stats: {
                        agi: 2
                    }
                },
                item: {
                    type: 'item',
                    name: 'Health Potion'
                }
            },
            inventory: [
                {
                    type: 'weapon',
                    name: 'Dagger',
                    stats: {
                        str: 2
                    }
                },
                {
                    type: 'weapon',
                    name: 'Club',
                    stats: {
                        str: 3,
                        agi: -1
                    }
                },
                {
                    type: 'weapon',
                    name: 'Staff',
                    stats: {
                        int: 2
                    }
                },
                {
                    type: 'weapon',
                    name: 'Main Gauche',
                    stats: {
                        str: 2,
                        agi: 1
                    }
                },
                {
                    type: 'weapon',
                    name: 'Glaive',
                    stats: {
                        str: 2,
                        agi: 4
                    }
                },
                {
                    type: 'armor',
                    name: 'Chainmail',
                    weight: 2,
                    stats: {
                        agi: 3,
                        str: 1
                    }
                },
                {
                    type: 'armor',
                    name: 'Fullplate',
                    weight: 3,
                    stats: {
                        agi: -3,
                        str: 4
                    }
                }
            ]
        };

        return player;
    })

    .controller('MenuController', [
        '$scope', '$state',
        ($scope, $state) => {
            $scope.menu = [
                { icon: 'ion-person', name: 'Player', state: 'player' },
                { icon: 'ion-earth', name: 'Explore', state: 'explore' },
                { icon: 'ion-briefcase', name: 'Inventory', state: 'inventory' },
                { icon: 'ion-gear-b', name: 'Options', state: 'options' }
            ];

            $scope.travel = (state) => {
                $state.go(state);
            };

            $scope.$root.$on('$stateChangeSuccess', (event, toState) => {
                $scope.$root.hideMenu = toState.name === 'home';
            });
        }
    ])

    .controller('HomeController', [
        '$scope', '$state', '$ionicPlatform', '$ionicHistory', '$cordovaOauth', 'OAUTH_KEYS',
        ($scope, $state, $ionicPlatform, $ionicHistory, $cordovaOauth, OAUTH_KEYS) => {

            $scope.skipAuth = () => {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('player');
            };

            $scope.auth = {
                google: () => {
                    $cordovaOauth.google(OAUTH_KEYS.google, ["email"]).then(function(result) {
                        window.alert("Response Object -> " + JSON.stringify(result));
                    }, function(error) {
                        window.alert("Error -> " + error);
                    });
                }
            };

            $ionicPlatform.ready(() => {

            });
    }])

    .controller('PlayerController', [
        '$scope', 'Player',
        ($scope, Player) => {
            $scope.player = Player;
    }])

    .controller('ClassChangeController', [
        '$scope', 'Player', 'CLASSES',
        ($scope, Player, CLASSES) => {
            $scope.player = Player;
            $scope.CLASSES = CLASSES;
        }
    ])

    .controller('InventoryController', [
        '$scope', 'Player',
        ($scope, Player) => {
            $scope.player = Player;
        }
    ])
;