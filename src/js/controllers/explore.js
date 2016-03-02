angular.module('retro').controller('ExploreController',
    ($scope, Player, LocationWatcher, Google, MapDrawing, Places, Monsters, BattleFlow) => {

        $scope.currentlySelected = null;
        $scope.centered = true;
        $scope.player = Player.get();

        const unCenter = () => $scope.centered = false;

        $scope.mapCreated = (map) => {
            $scope.map = map;
            const position = LocationWatcher.current();
            MapDrawing.drawMe(map, position);
            $scope.centerOn(position);
            MapDrawing.drawHomepoint(map, Player.get().homepoint);
            $scope.findMe();
            $scope.watchMe();
            MapDrawing.drawPlaces(map, Places.get());
            MapDrawing.drawMonsters(map, Monsters.get(), $scope.select);
            MapDrawing.addMapEvents(map, unCenter);
        };

        $scope.fight = () => {
            BattleFlow.start($scope.currentlySelected.monster);
            $scope.reset();
        };

        $scope.centerOnMe = () => {
            $scope.findMe();
            $scope.centered = true;
        };

        const _setSelected = (opts) => {
            $scope.currentlySelected = opts;
        };

        $scope.select = (opts) => {
            $scope.reset();
            _setSelected(opts);
            $scope.$apply();
        };

        $scope.reset = () => {
            if($scope.currentlySelected && $scope.currentlySelected.infoWindow) {
                $scope.currentlySelected.infoWindow.close();
            }
            _setSelected(null);
        };

        $scope.findMe = () => {
            LocationWatcher.ready.then(coords => $scope.centerOn(coords, true));
        };

        $scope.watchMe = () => {
            LocationWatcher.watch.then(null, null, (coords) => {
                $scope.centerOn(coords, $scope.centered);
            });
        };

        $scope.centerOn = (coords, centerMap = false) => {
            if(!$scope.map) return;
            if(!coords.latitude || !coords.longitude) return;
            const position = new Google.maps.LatLng(coords.latitude, coords.longitude);

            if(centerMap) { $scope.map.setCenter(position); }

            MapDrawing.setCurrentPosition(position);
        };

        // this fixes google maps after battle
        $scope.$on('$ionicView.afterEnter', () => {
            ionic.trigger('resize');
        });

        Monsters.observer.then(null, null, () => {
            MapDrawing.drawMonsters($scope.map, Monsters.get(), $scope.select);
        });

        Player.observer.then(null, null, () => {
            $scope.player = Player.get();
        });
    }
);