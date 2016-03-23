angular.module('retro').directive('manaDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: `
                <div class="icon-container centered">
                    <i class="icon game-icon game-icon-global-mp"></i> {{target.stats.mp.__current | number:0}}/{{target.stats.mp.maximum | number:0}}
                </div>
            `
    };
});