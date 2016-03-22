angular.module('retro').directive('cooldown', () => {
    return {
        restrict: 'E',
        scope: {
            turns: '='
        },
        controller: ($scope) => {
            $scope.displayTurns = Math.max($scope.turns, 0);
        },
        template: `
                <span class="icon-container centered">
                    <i class="icon game-icon game-icon-skill-cooldown"></i> <ng-pluralize count="displayTurns", when="{'0': 'Instant', 'one': '1 round', 'other': '{} rounds'}"></ng-pluralize>
                </span>
            `
    };
});