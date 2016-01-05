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
            controller: 'CreateCharacterController',
            data: { requiresLogin: true }
        })
        .state('player', {
            url: '/player',
            templateUrl: 'player',
            controller: 'PlayerController',
            data: { requiresLogin: true }
        })
        .state('changeclass', {
            url: '/changeclass',
            templateUrl: 'changeclass',
            controller: 'ClassChangeController',
            data: { requiresLogin: true }
        })
        .state('inventory', {
            url: '/inventory',
            templateUrl: 'inventory',
            controller: 'InventoryController',
            data: { requiresLogin: true }
        })
        .state('inventory.armor', {
            url: '/armor',
            views: {
                'armor-tab': {
                    templateUrl: 'inventory-tab-armor'
                }
            },
            data: { requiresLogin: true }
        })
        .state('inventory.weapons', {
            url: '/weapons',
            views: {
                'weapons-tab': {
                    templateUrl: 'inventory-tab-weapons'
                }
            },
            data: { requiresLogin: true }
        })
        .state('inventory.items', {
            url: '/items',
            views: {
                'items-tab': {
                    templateUrl: 'inventory-tab-items'
                }
            },
            data: { requiresLogin: true }
        })
        .state('options', {
            url: '/options',
            templateUrl: 'options',
            data: { requiresLogin: true }
        })
        .state('explore', {
            url: '/explore',
            templateUrl: 'explore',
            controller: 'ExploreController',
            data: { requiresLogin: true }
        });
});