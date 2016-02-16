angular.module('retro').directive('skillEffectDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            effects: '=',
            multiplier: '='
        },
        link: (scope) => {
            console.log(scope);
        },
        template: `
                <div class="row" ng-repeat="effect in effects">
                    <div class="col col-20 col-offset-20 text-right">
                        <strong>{{effect.name}}</strong>
                    </div>

                    <div class="col text-left">
                        <span>{{effect.value.min_possible * multiplier}}</span>
                        <span ng-if="effect.value.min_possible !== effect.value.max_possible">- {{effect.value.max_possible*multiplier}}</span>
                        <ng-pluralize ng-if="effect.extra.string" count="effect.value.max_possible*multiplier" when="{'one': ' '+effect.extra.string, 'other': ' '+effect.extra.string+'s'}"></ng-pluralize>
                        <span ng-if="effect.extra.chance"> ({{effect.extra.chance + effect.accuracy}}% chance)</span>
                    </div>
                </div>
            `
    };
});