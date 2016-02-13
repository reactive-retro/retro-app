angular.module('retro').directive('healthDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        template: `
                <div>
                    <i class="icon ion-heart assertive"></i> {{target.stats.hp.__current}} / {{target.stats.hp.maximum}}
                </div>
            `
    };
});