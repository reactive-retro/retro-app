angular.module('retro').controller('CraftingController',
    ($scope, $stateParams, $ionicModal, $ionicPopup, Player, CraftingFlow) => {
        $scope.player = Player.get();
        Player.observer.then(null, null, (player) => {
            $scope.player = player;
            const { primary, secondary } = $scope.items;
            if(primary)   $scope.items.primary   = _.find($scope.player.inventory, { itemId: primary.itemId });
            if(secondary) $scope.items.secondary = _.find($scope.player.inventory, { itemId: secondary.itemId });
        });

        $scope.place = $stateParams.place;

        $scope.items = {};
        $scope.validItemTypes = {
            primary: ['armor', 'weapon'],
            secondary: ['material']
        };

        $scope.setPrimaryFrom = (type) => $scope.items.primary = $scope.player.equipment[type];

        $scope.chooseItem = (type) => {
            $scope.activeType = type;

            $ionicModal.fromTemplateUrl('chooseitem.crafting', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.isMod = () => $scope.items.secondary.type === 'material';

        $scope.modCost = () => Math.floor($scope.items.primary.value / ($scope.items.primary.numMods + 1)) + $scope.items.secondary.value;

        $scope.isValidMod = () => {
            return $scope.items.primary
                && $scope.items.primary.numMods < $scope.items.primary.maxMods
                && $scope.items.primary.levelRequirement >= $scope.items.secondary.levelRequirement;
        };

        $scope.cost = () => {
            if($scope.isMod()) return $scope.modCost();
        };

        $scope.isValidCost = () => $scope.player.stats.gold >= $scope.cost();

        $scope.isValidCraft = () => {
            return $scope.items.primary && $scope.items.secondary && $scope.isValidCost();
        };

        $scope.isValidOperation = () => {
            if($scope.isMod()) return $scope.isValidMod();
        };

        $scope.doCraft = () => {
            if($scope.isMod()) return CraftingFlow.doMod($scope.place, $scope.items.primary, $scope.items.secondary);
        };
    }
);