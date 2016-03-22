angular.module('retro').controller('TraitChangeController',
    ($scope, $ionicModal, Player, Traits) => {
        $scope.player = Player.get();

        const getAllTraits = (baseTraits) => _(baseTraits)
            .each(trait => trait.traitLevel = trait.traitClasses[_.keys(trait.traitClasses)[0]])
            .sortBy([
                'traitLevel',
                'traitName'
            ])
            .groupBy(trait => {
                return _.keys(trait.traitClasses)[0];
            })
            .reduce((res, val, key) => {
                res.push({ prof: key, profTraits: val });
                return res;
            }, []);

        $scope.allTraits = getAllTraits(Traits.get());

        $scope.openTraitInfo = (trait) => {
            $scope.activeTrait = trait;

            $ionicModal.fromTemplateUrl('changetrait.info', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then((modal) => {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.isTraitSet = (trait) => _.contains($scope.player.traits, trait);

        Player.observer.then(null, null, (player) => $scope.player = player);
        Traits.observer.then(null, null, (traits) => $scope.allTraits = getAllTraits(traits));
    }
);