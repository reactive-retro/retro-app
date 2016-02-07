angular.module('retro').directive('statBar', () => {
    return {
        restrict: 'E',
        scope: {
            target: '=',
            stat: '@'
        },
        template: `
                <div class="stat-bar-container">
                    <div class="stat-bar {{stat}}" style="width: {{target.stats[stat].__current/target.stats[stat].maximum*100}}%"></div>
                </div>
            `
    };
});