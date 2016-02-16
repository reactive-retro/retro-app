angular.module('retro').directive('cooldown', () => {
    return {
        restrict: 'E',
        scope: {
            turns: '='
        },
        template: `
                <span>
                    <i class="icon ion-clock"></i> <ng-pluralize count="turns", when="{'0': 'Instant', 'one': '1 round', 'other': '{} rounds'}"></ng-pluralize>
                </span>
            `
    };
});