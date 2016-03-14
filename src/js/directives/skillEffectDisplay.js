angular.module('retro').directive('skillEffectDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            effects: '=',
            multiplier: '='
        },
        template: `
                <div class="row" ng-repeat="effect in effects">
                    <div class="col col-20 col-offset-20 text-right">
                        <strong>{{effect.name}}</strong>
                    </div>

                    <div class="col text-left">
                        <span>{{effect.value ? effect.value.min_possible * multiplier : ''}}</span>
                        <span ng-if="effect.value.min_possible !== effect.value.max_possible">- {{effect.value ? effect.value.max_possible*multiplier : ''}}</span>
                        <ng-pluralize ng-if="effect.extra.string" count="effect.value ? effect.value.max_possible*multiplier : 0" when="{'0': 0, 'one': ' '+effect.extra.string, 'other': ' '+effect.extra.string+'s'}"></ng-pluralize>
                        <span ng-if="effect.extra.chance"> ({{effect.extra.chance + effect.accuracy}}% chance)</span>
                    </div>
                </div>
            `
    };
});