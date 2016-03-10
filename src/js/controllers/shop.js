angular.module('retro').controller('ShopController',
    ($scope, $stateParams, $ionicPopup, Player, ItemContainerFlow) => {

        const { derivedType, name } = $stateParams.containerData;
        $scope.pageTitle = derivedType;
        $scope.contents = ItemContainerFlow.getNotYetActivatedItems($stateParams.containerData);
        $scope.name = name;
        $scope.footerButton = {
            text: 'Buy',
            disabled: (item) => item.value > $scope.player.stats.gold,
            click: (item) => {
                const callback = (items) => $scope.contents = items;

                const confirmPopup = $ionicPopup.confirm({
                    title: `Buy ${item.name}`,
                    template: `Are you sure you want to buy this for ${item.value} gold?`
                });

                confirmPopup.then(res => {
                    if(!res) return;
                    ItemContainerFlow.buyItem($stateParams.containerData, item.itemId, callback);
                });

            },
            blockedBy: 'Shop'
        };

        $scope.showGold = true;

        $scope.player = Player.get();
        Player.observer.then(null, null, () => $scope.player = Player.get());
    }
);