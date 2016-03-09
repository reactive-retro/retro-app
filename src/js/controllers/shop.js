angular.module('retro').controller('ShopController',
    ($scope, $stateParams, $ionicPopup, Player, ItemContainerFlow) => {

        const { derivedType, contents, name } = $stateParams.containerData;
        $scope.pageTitle = derivedType;
        $scope.contents = contents;
        $scope.name = name;
        $scope.footerButton = { text: 'Buy', click: ItemContainerFlow.buyItem, blockedBy: 'Shop' };

        $scope.player = Player.get();
        Player.observer.then(null, null, () => $scope.player = Player.get());
    }
);