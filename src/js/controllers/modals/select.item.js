angular.module('retro').controller('ItemChangeModalController',
    ($scope, Player, Skills, ItemChangeFlow, AttributeCalculator) => {

        $scope.activeItemAttrs = AttributeCalculator.itemEffects($scope.activeItem);

        $scope.setItemInSlot = (item, slot) => {
            // unset skill
            if($scope.player.items[slot] === item.name) {
                ItemChangeFlow.change(null, slot);
                return;
            }

            // set skill
            ItemChangeFlow.change(item, slot);
        };

        $scope.closeItemInfo = () => $scope.modal.hide();
    }
);