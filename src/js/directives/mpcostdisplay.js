angular.module('retro').directive('mpCost', () => {
    return {
        restrict: 'E',
        scope: {
            cost: '='
        },
        controller: ($scope) => {
            $scope.displayCost = Math.max($scope.cost, 0);
        },
        template: `
                <span class="icon-container">
                    <i class="icon game-icon game-icon-global-mp skill-display-mp"></i> {{displayCost}} mp
                </span>
            `
    };
});