angular.module('retro').directive('healthDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: `
                <div class="icon-container centered">
                    <i class="icon game-icon game-icon-global-hp"></i> {{target.stats.hp.__current | number:0}} / {{target.stats.hp.maximum | number:0}}
                </div>
            `
    };
});