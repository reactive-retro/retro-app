angular.module('retro').directive('skillTarget', () => {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: `
                <span class="icon-container">
                    <i class="icon game-icon game-icon-skill-target"></i> {{target}}
                </span>
            `
    };
});