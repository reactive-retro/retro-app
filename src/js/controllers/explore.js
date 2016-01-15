angular.module('retro').controller('ExploreController',
    ($scope, $ionicLoading, Player, LocationWatcher, Google, Settings, MapDrawing) => {

        $scope.currentlySelected = null;

        $scope.mapCreated = (map) => {
            $scope.map = map;
            var position = LocationWatcher.current();
            MapDrawing.drawMe(map, position);
            $scope.centerOn(position);
            MapDrawing.drawHomepoint(map, Player.get().homepoint);
            $scope.findMe();
            $scope.watchMe();
            MapDrawing.drawPlaces(map, Settings.places);
            MapDrawing.drawMonsters(map, Settings.monsters, $scope.select);
            MapDrawing.addMapEvents(map);
        };

        const _setSelected = (opts) => {
            $scope.currentlySelected = opts;
            $scope.$apply();
        };

        $scope.select = (opts) => {
            $scope.reset();
            _setSelected(opts);
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
                $scope.centerOn(coords);
            });
        };

        $scope.centerOn = (coords, centerMap = false) => {
            if(!$scope.map) { return; }
            if(!coords.latitude || !coords.longitude) { return; }
            var position = new Google.maps.LatLng(coords.latitude, coords.longitude);

            if(centerMap) { $scope.map.setCenter(position); }

            MapDrawing.setCurrentPosition(position);
        };
    }
);