angular.module('retro').directive('goldDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            extraInfo: '='
        },
        template: `
                <div>
                    <i class="icon ion-social-usd"></i> {{value}}
                    <span class="pull-right italic">{{extraInfo}}</span>
                </div>
            `
    };
});