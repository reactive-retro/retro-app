angular.module('retro').config(($ionicConfigProvider, $urlRouterProvider, $stateProvider) => {

    $ionicConfigProvider.views.swipeBackEnabled(false);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'index',
            controller: 'HomeController'
        })
        .state('create', {
            url: '/create',
            templateUrl: 'createchar',
            controller: 'CreateCharacterController'
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
});