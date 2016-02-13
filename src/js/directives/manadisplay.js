angular.module('retro').directive('manaDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: `
                <div>
                    <i class="icon ion-waterdrop positive"></i> {{target.stats.mp.__current}} / {{target.stats.mp.maximum}}
                </div>
            `
    };
});