angular.module('retro').directive('colorText', () => {
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
});