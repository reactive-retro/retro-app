angular.module('retro').directive('goldDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            extraInfo: '=',
            alignGoldRight: '='
        },
        template: `
                <span class="icon-container">
                    <i class="icon game-icon game-icon-global-money"></i>
                    <span ng-class="{'pull-right': alignGoldRight}"> {{value | number:0}}</span>
                    <span ng-if="extraInfo" class="pull-right italic">{{extraInfo}}</span>
                </span>
            `
    };
});