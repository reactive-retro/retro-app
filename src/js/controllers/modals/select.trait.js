angular.module('retro').controller('TraitChangeModalController',
    ($scope, Player, Traits, TraitChangeFlow, AttributeCalculator) => {

        $scope.activeTraitAttrs = AttributeCalculator.traitEffects($scope.activeTrait, false);

        $scope.setTraitInSlot = (trait, slot) => {
            // unset skill
            if($scope.player.traits[slot] === trait) {
                TraitChangeFlow.change(null, slot);
                return;
            }

            // set skill
            TraitChangeFlow.change(trait, slot);
        };

        $scope.closeTraitInfo = () => {
            $scope.modal.hide();
            $scope.modal.remove();
        };
    }
);