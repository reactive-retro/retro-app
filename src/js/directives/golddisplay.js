angular.module('retro').directive('goldDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            extraInfo: '='
        },
        template: `
                <span class="icon-container">
                    <i class="icon game-icon game-icon-global-money"></i> {{value | number:0}}
                    <span class="pull-right italic">{{extraInfo}}</span>
                </span>
            `
    };
});