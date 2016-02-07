angular.module('retro').directive('colorText', () => {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            preText: '@'
        },
        template: `
                <span ng-class="{assertive: value < 0, balanced: value > 0}">{{preText}} {{value}}</span>
            `
    };
});