angular.module('retro').directive('mpCost', () => {
    return {
        restrict: 'E',
        scope: {
            cost: '='
        },
        template: `
                <span>
                    <i class="icon ion-waterdrop positive"></i> {{cost}} mp
                </span>
            `
    };
});