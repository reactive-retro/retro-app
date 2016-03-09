angular.module('retro').controller('TreasureChestController',
    ($scope, $stateParams, $ionicPopup, Player, ItemContainerFlow) => {

        const { derivedType, name } = $stateParams.containerData;
        $scope.pageTitle = derivedType;
        $scope.contents = ItemContainerFlow.getNotYetActivatedItems($stateParams.containerData);
        $scope.name = name;
        $scope.footerButton = {
            text: 'Take',
            click: (item) => {
                const callback = (items) => $scope.contents = items;
                ItemContainerFlow.takeItem($stateParams.containerData, item.itemId, callback);
            },
            blockedBy: 'Shop'
        };

        $scope.player = Player.get();
        Player.observer.then(null, null, () => $scope.player = Player.get());
    }
);