angular.module('retro').controller('ExploreController',
    ($scope, $ionicLoading, Player, LocationWatcher, Google, Settings, MAP_COLORS) => {
        // TODO refactor all of this into services, the directive, etc, maybe make the directive take a places array

        const MAX_VIEW_RADIUS = Settings.RADIUS; //meters

        const bounds = new google.maps.LatLngBounds();

        const mercatorWorldBounds = [
            new Google.maps.LatLng(85,180),
            new Google.maps.LatLng(85,90),
            new Google.maps.LatLng(85,0),
            new Google.maps.LatLng(85,-90),
            new Google.maps.LatLng(85,-180),
            new Google.maps.LatLng(0,-180),
            new Google.maps.LatLng(-85,-180),
            new Google.maps.LatLng(-85,-90),
            new Google.maps.LatLng(-85,0),
            new Google.maps.LatLng(-85,90),
            new Google.maps.LatLng(-85,180),
            new Google.maps.LatLng(0,180),
            new Google.maps.LatLng(85,180)
        ];

        // radius in meters
        const drawCircle = (point, radius) => {
            var d2r = Math.PI / 180;   // degrees to radians
            var r2d = 180 / Math.PI;   // radians to degrees
            var earthsradius = 3963; // 3963 is the radius of the earth in miles
            var points = 32;

            // find the radius in lat/lon - convert meters to miles
            var rlat = (radius*0.000621371192 / earthsradius) * r2d;
            var rlng = rlat / Math.cos(point.lat() * d2r);

            var start = points+1;
            var end = 0;

            var extp = [];

            for (var i=start; i>end; i--) {
                var theta = Math.PI * (i / (points/2));
                var ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
                var ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
                extp.push(new Google.maps.LatLng(ex, ey));
                bounds.extend(extp[extp.length-1]);
            }
            return extp;
        };

        $scope.addEvents = () => {
            var lastValidCenter = null;

            google.maps.event.addListener($scope.map, 'center_changed', () => {
                if (bounds.contains($scope.map.getCenter())) {
                    lastValidCenter = $scope.map.getCenter();
                    return;
                }

                $scope.map.panTo(lastValidCenter);
            });
        };

        $scope.mapCreated = (map) => {
            $scope.map = map;
            var position = LocationWatcher.current();
            $scope.drawMe(position);
            $scope.centerOn(position);
            $scope.drawHomepoint(Player.get().homepoint);
            $scope.findMe();
            $scope.watchMe();
            $scope.drawPlaces(Settings.places);
            $scope.drawMonsters(Settings.monsters);
            $scope.addEvents();
        };

        $scope.places = [];

        $scope.drawPlaces = (places) => {
            _.each($scope.places, place => place.setMap(null));
            _.each(places, place => {
                $scope.places.push(new Google.maps.Marker({
                    position: place.geometry.location,
                    map: $scope.map,
                    icon: {
                        path: Google.maps.SymbolPath.CIRCLE,
                        strokeColor: MAP_COLORS.poi.outline,
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: MAP_COLORS.poi.fill,
                        fillOpacity: 1,
                        scale: 5
                    }
                }));
            });
        };

        $scope.monsters = [];

        $scope.drawMonsters = (monsters) => {
            _.each($scope.monsters, monster => monster.setMap(null));
            _.each(monsters, monster => {
                $scope.places.push(new Google.maps.Marker({
                    position: new Google.maps.LatLng(monster.location.lat, monster.location.lon),
                    map: $scope.map,
                    icon: {
                        path: Google.maps.SymbolPath.CIRCLE,
                        strokeColor: MAP_COLORS.monster.outline,
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: MAP_COLORS.monster.fill,
                        fillOpacity: 1,
                        scale: 5
                    }
                }));
            });
        };

        $scope.drawHomepoint = (coords) => {
            const homepointCenter = new Google.maps.LatLng(coords.lat, coords.lon);

            $scope.homepoint = new Google.maps.Marker({
                position: homepointCenter,
                map: $scope.map,
                icon: {
                    path: Google.maps.SymbolPath.CIRCLE,
                    strokeColor: MAP_COLORS.homepoint.outline,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: MAP_COLORS.homepoint.fill,
                    fillOpacity: 1,
                    scale: 5
                }
            });

            const miasmaOptions = {
                strokeColor: MAP_COLORS.miasma.outline,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: MAP_COLORS.miasma.fill,
                fillOpacity: 0.35,
                map: $scope.map,
                paths: [mercatorWorldBounds, drawCircle(homepointCenter, MAX_VIEW_RADIUS)]
            };
            $scope.miasma = new Google.maps.Polygon(miasmaOptions);

        };

        $scope.drawMe = (coords) => {
            $scope.curPos = new Google.maps.Marker({
                position: new Google.maps.LatLng(coords.latitude, coords.longitude),
                map: $scope.map,
                icon: {
                    path: Google.maps.SymbolPath.CIRCLE,
                    strokeColor: MAP_COLORS.hero.outline,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: MAP_COLORS.hero.fill,
                    fillOpacity: 1,
                    scale: 5
                }
            });

            var affectRadius = new Google.maps.Circle({
                fillColor: MAP_COLORS.heroRadius.fill,
                strokeColor: MAP_COLORS.heroRadius.outline,
                strokeWeight: 1,
                radius: 50,
                map: $scope.map
            });

            affectRadius.bindTo('center', $scope.curPos, 'position');
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

            $scope.curPos.setPosition(position);

            //socket.emit('nearby', {name: Player.get().name, latitude: coords.latitude, longitude: coords.longitude}, (err, success) => {
            //    console.log(err, JSON.stringify(success));
            //});
        };
    }
);