angular.module('retro').controller('InventoryController',
    ($scope, $stateWrapper, $ionicModal, $ionicPopup, Player, EquipFlow, Settings) => {
        $scope.player = Player.get();
        Player.observer.then(null, null, (player) => $scope.player = player);
        $scope.isEmpty = _.isEmpty;

        $scope.equip = (item) => () => {
            EquipFlow.equip(item);
            $stateWrapper.go('player');
        };

        $scope.setItem = (item) => () => {
            $scope.activeItem = item;

            $ionicModal.fromTemplateUrl('changeitem.info', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.hideEquip = (item) => item.levelRequirement > $scope.player.professionLevels[$scope.player.profession];

        $scope.maxInvSize = Settings.INVENTORY_SIZE;

        $scope.tryToSell = (item) => () => {
            const value = Math.floor(item.value/$scope.player.sellModifier);

            if(item.quantity > 1) {

                const buttons = [
                    { text: 'Cancel', type: 'item-sell-button' },
                    { text: 'x1', type: 'item-sell-button', onTap: () => 1 }
                ];

                if(item.quantity > 25) buttons.push({ text: 'x25', type: 'item-sell-button', onTap: () => 25 });
                buttons.push({ text: 'All', type: 'item-sell-button', onTap: () => item.quantity });

                const showPopup = $ionicPopup.show({
                    title: `Sell ${item.name}`,
                    template: `How many do you want to sell for ${value} gold (per item)?`,
                    buttons
                });

                showPopup.then((res) => {
                    if(!res) return;
                    EquipFlow.sell(item, res);
                });

                return;
            }

            const confirmPopup = $ionicPopup.confirm({
                title: `Sell ${item.name}`,
                template: `Are you sure you want to sell this for ${value} gold?`
            });

            confirmPopup.then((res) => {
                if(!res) return;
                EquipFlow.sell(item);
            });
        };
    }
);