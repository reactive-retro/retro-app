angular.module('retro').directive('effectBar', ($ionicModal, AttributeCalculator) => {
    return {
        restrict: 'E',
        scope: {
            target: '=',
            maxItems: '='
        },
        controller: ($scope) => {
            $scope.getEffectIcon = AttributeCalculator.getEffectIcon;
            $scope.getEffectColor = AttributeCalculator.getEffectColor;

            $scope.closeModal = () => {
                $scope.modal.hide();
                $scope.modal.remove();
            };

            $scope.expandEffects = () => {
                if($scope.target.statusEffects.length === 0) return;
                $ionicModal.fromTemplateUrl('effects.info', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then((modal) => {
                    console.log(modal);
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };
        },
        template: `
                <div class="effect-bar-container" ng-click="expandEffects()">
                    <i class="effect icon game-icon game-icon-status-{{getEffectIcon(effect.effectName)}} {{getEffectColor(effect.effectName)}}"
                       ng-repeat="effect in target.statusEffects | limitTo:maxItems"></i>
                </div>
            `
    };
});