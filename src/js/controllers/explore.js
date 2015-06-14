angular.module('retro').controller('ExploreController',
    ($scope, $ionicLoading, Player, LocationWatcher, socket) => {

        // http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates

        $scope.mapCreated = (map) => {
            $scope.map = map;
            var position = LocationWatcher.current();
            $scope.drawMe(position);
            $scope.centerOn(position);
            $scope.findMe();
        };

        $scope.drawMe = (coords) => {
            $scope.curPos = new google.maps.Marker({
                position: new google.maps.LatLng(coords.latitude, coords.longitude),
                map: $scope.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeColor: '#0000ff',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#0000aa',
                    fillOpacity: 1,
                    scale: 5
                }
            });

            var affectRadius = new google.maps.Circle({
                fillColor: '#ff00ff',
                strokeColor: '#ff00ff',
                strokeWeight: 1,
                radius: 50,
                map: $scope.map
            });

            affectRadius.bindTo('center', $scope.curPos, 'position');
        };

        $scope.findMe = () => {
            LocationWatcher.watch.then(null, null, (coords) => {
                $scope.centerOn(coords);
            });
        };

        $scope.centerOn = (coords) => {
            if(!$scope.map) { return; }

            var position = new google.maps.LatLng(coords.latitude, coords.longitude);

            $scope.map.setCenter(position);

            $scope.curPos.setPosition(position);

            //socket.emit('nearby', {name: Player.get().name, latitude: coords.latitude, longitude: coords.longitude}, (err, success) => {
            //    console.log(err, JSON.stringify(success));
            //});
        };
    }
);