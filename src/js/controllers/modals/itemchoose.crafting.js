angular.module('retro').controller('CraftingItemChooseController',
    ($scope, Player) => {
        $scope.player = Player.get();

        $scope.isValidItem = (item) => _.contains($scope.validItemTypes[$scope.activeType], item.type) && !item.isDefault;

        $scope.choose = (item) => () => {
            $scope.items[$scope.activeType] = item;
            $scope.close();
        };

        $scope.close = () => {
            $scope.modal.hide();
            $scope.modal.remove();
        };
    }
);