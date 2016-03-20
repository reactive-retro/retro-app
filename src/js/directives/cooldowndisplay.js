angular.module('retro').directive('cooldown', () => {
    return {
        restrict: 'E',
        scope: {
            turns: '='
        },
        template: `
                <span class="icon-container centered">
                    <i class="icon game-icon game-icon-skill-cooldown"></i> <ng-pluralize count="turns", when="{'0': 'Instant', 'one': '1 round', 'other': '{} rounds'}"></ng-pluralize>
                </span>
            `
    };
});