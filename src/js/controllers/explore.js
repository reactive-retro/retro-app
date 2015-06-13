angular.module('retro').controller('ExploreController',
    ($scope, $ionicLoading, LocationWatcher) => {

        // http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates

        $scope.mapCreated = (map) => {
            $scope.map = map;
            $scope.centerOn(LocationWatcher.current());
            $scope.findMe();
        };

        $scope.findMe = () => {
            LocationWatcher.watch.then(null, null, (coords) => {
                $scope.centerOn(coords);
            });
        };

        $scope.centerOn = (coords) => {
            if(!$scope.map) { return; }
            $scope.map.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
        };
    }
);