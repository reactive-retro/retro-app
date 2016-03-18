angular.module('retro').directive('skillEffectDisplay', () => {
    return {
        restrict: 'E',
        scope: {
            effects: '=',
            multiplier: '='
        },
        controller: ($scope) => {
            $scope.getEffectIcon = (effectName) => effectName.toLowerCase().split('-').join('-minus').split('+').join('-plus');
        },
        template: `
                <div class="row" ng-repeat="effect in effects">
                    <div class="col col-30 text-right icon-container">
                        <span class="pull-right">
                            <i class="icon game-icon game-icon-status-{{getEffectIcon(effect.name)}}"></i>
                            <strong class="valign-top">{{effect.name}}</strong>
                        </span>
                    </div>

                    <div class="col text-left">
                        <span>{{effect.value ? effect.value.min_possible * multiplier : ''}}</span>
                        <span ng-if="effect.value.min_possible !== effect.value.max_possible">- {{effect.value ? effect.value.max_possible*multiplier : ''}}</span>
                        <ng-pluralize ng-if="effect.extra.string && effect.extra.pluralize !== false"
                                      count="effect.value.max_possible*multiplier"
                                      when="{'one': ' '+effect.extra.string, 'other': ' '+effect.extra.string+'s'}"></ng-pluralize>
                        <span ng-if="effect.extra.string && effect.extra.pluralize === false">{{effect.extra.string}}</span>
                        <span ng-if="effect.extra.chance"> ({{effect.extra.chance + (effect.accuracy || 0)}}% chance)</span>
                    </div>
                </div>
            `
    };
});