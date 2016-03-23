angular.module('retro').directive('skillEffectDisplay', (AttributeCalculator) => {
    return {
        restrict: 'E',
        scope: {
            effects: '=',
            multiplier: '='
        },
        controller: ($scope) => {
            $scope.getEffectIcon = AttributeCalculator.getEffectIcon;
            $scope.getEffectColor = AttributeCalculator.getEffectColor;
        },
        template: `
                <div class="row" ng-repeat="effect in effects">
                    <div class="col col-30 text-right icon-container">
                        <span class="pull-right">
                            <i class="icon game-icon game-icon-status-{{getEffectIcon(effect.name)}} {{getEffectColor(effect)}}"></i>
                            <strong class="valign-top">{{effect.extra.displayName || effect.name}}</strong>
                        </span>
                    </div>

                    <div class="col text-left" ng-if="effect.displayData.effectDisplay.value && !effect.displayData.min.display" ng-class="{ 'effect-modified': effect.displayData.effectDisplay.traitModified }" >{{effect.displayData.effectDisplay.value}}</div>
                    <div class="col text-left" ng-if="effect.displayData.min.display">
                        <span ng-class="{ 'effect-modified': effect.displayData.min.traitModified }" ng-if="effect.displayData.min.display">{{effect.displayData.min.value(multiplier)}}</span>
                        <span ng-class="{ 'effect-modified': effect.displayData.max.traitModified }" ng-if="effect.displayData.max.display">- {{effect.displayData.max.value(multiplier)}}</span>
                        <ng-pluralize ng-if="effect.extra.string && effect.extra.pluralize !== false"
                                      count="effect.displayData.max.value(multiplier)"
                                      when="{'one': ' '+effect.extra.string, 'other': ' '+effect.extra.string+'s'}"></ng-pluralize>
                        <span ng-if="effect.extra.string && effect.extra.pluralize === false">{{effect.extra.string}}</span>
                        <span ng-class="{ 'effect-modified': effect.displayData.chance.traitModified }" ng-if="effect.extra.chance && effect.displayData.min.display"> ({{effect.displayData.chance.value()}}% chance)</span>
                        <span ng-class="{ 'effect-modified': effect.displayData.chance.traitModified }" ng-if="effect.extra.chance && !effect.displayData.min.display">{{effect.displayData.chance.value()}}% chance</span>
                    </div>
                </div>
            `
    };
});