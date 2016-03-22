angular.module('retro').directive('traitEffectDisplay', (AttributeCalculator) => {
    return {
        restrict: 'E',
        scope: {
            effects: '='
        },
        controller: ($scope) => {
            $scope.getEffectIcon = AttributeCalculator.getEffectIcon;
            $scope.getEffectColor = AttributeCalculator.getEffectColor;

            $scope.subEffects = [
                { name: 'effect', string: 'round' },
                { name: 'damage', string: 'damage' },
                { name: 'hitchance', string: 'hit%' },
                { name: 'cooldown', string: 'round' },
                { name: 'duration', string: 'round' },
                { name: 'cost', string: 'MP' },
                { name: 'stats' }
            ];
        },
        template: `
                <div class="row" ng-repeat="(effectName, effectData) in effects">
                    <div class="col col-30 text-right icon-container">
                        <span class="pull-right">
                            <i class="icon game-icon game-icon-status-{{getEffectIcon(effectName)}} {{getEffectColor(effectName)}}"></i>
                            <strong class="valign-top">{{effectName}}</strong>
                        </span>
                    </div>

                    <div class="col text-left" ng-if="effectData.effectDisplay">{{effectData.effectDisplay}}</div>
                    <div class="col text-left" ng-if="!effectData.effectDisplay">
                        <div class="row padding-0" ng-repeat="subEffect in subEffects" ng-if="effectData[subEffect.name]">
                            <div class="col padding-0" ng-include="'trait-effect-type-'+subEffect.name"></div>
                        </div>
                    </div>
                </div>
            `
    };
});