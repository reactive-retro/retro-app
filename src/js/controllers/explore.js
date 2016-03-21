angular.module('retro').controller('ExploreController',
    ($scope, $timeout, $filter, $ionicPopup, Player, LocationWatcher, Google, MapDrawing, Places, Monsters, Settings, ExploreFlow, BattleFlow, ItemContainerFlow, Toaster) => {

        $scope.currentlySelected = null;
        $scope.centered = true;
        $scope.player = Player.get();
        $scope.coords = null;
        $scope.curHomepoint = $scope.player.homepoint;

        const unCenter = () => $scope.centered = false;

        $scope.mapCreated = (map) => {
            $scope.map = map;
            const position = LocationWatcher.current();
            MapDrawing.drawMe(map, position, $scope.changeHomepoint);
            $scope.centerOn(position);
            MapDrawing.drawHomepoint(map, $scope.curHomepoint);
            $scope.findMe();
            $scope.watchMe();
            MapDrawing.drawPlaces(map, Places.get(), $scope.select);
            MapDrawing.drawMonsters(map, Monsters.get(), $scope.select);
            MapDrawing.addMapEvents(map, unCenter);
        };

        $scope.changeHomepoint = () => {
            if(!$scope.player.canChangeHomepoint) {
                const newTime = new Date($scope.player.lastHomepointChange);
                newTime.setHours(newTime.getHours() + Settings.HOMEPOINT_CHANGE_HOURS);
                const timeDisplay = $filter('date')(newTime, 'MMM d, y h:mm a');

                $ionicPopup.alert({
                    title: 'Can\'t Move Beacon!',
                    template: `Your beacon-moving powers have been exhausted until ${timeDisplay}.`
                });
                return;
            }

            const confirmPopup = $ionicPopup.confirm({
                title: 'Place New Light Beacon',
                template: 'Are you sure you want to place a new Beacon of Light? Doing so will reset all monsters and places, and you won\'t be able to do this for another 4 hours.'
            });

            confirmPopup.then((res) => {
                if(!res) return;
                ExploreFlow.moveHomepoint($scope.coords);
            });
        };

        $scope.shop = () => {
            const monstersNeeded = ItemContainerFlow.canEnter($scope.currentlySelected.place);
            if(monstersNeeded !== 0) {
                return Toaster.show(`You need to kill ${monstersNeeded} more monster${monstersNeeded > 1 ? 's' : ''} to open this chest!`);
            }
            ItemContainerFlow.enter($scope.currentlySelected.place);
            $scope.reset();
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
            $timeout(() => {
                $scope.currentlySelected = opts;
            }, 0);
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
                $scope.centerOn(coords, $scope.centered);
            });
        };

        $scope.centerOn = (coords, centerMap = false) => {
            if(!$scope.map) return;
            if(!coords.latitude || !coords.longitude) return;
            $scope.coords = { lat: coords.latitude, lon: coords.longitude };
            const position = new Google.maps.LatLng(coords.latitude, coords.longitude);

            if(centerMap) { $scope.map.setCenter(position); }

            MapDrawing.setCurrentPosition(position);
        };

        $scope.getMonsterName = () => {
            const monster = $scope.currentlySelected.monster;
            if(!monster.monsters) return monster.name;

            if(monster.monsters.length === 1) return monster.monsters[0].name;
            return `${monster.monsters.length} monsters`;
        };

        // this fixes google maps after battle
        $scope.$on('$ionicView.afterEnter', () => {
            ionic.trigger('resize');
        });

        Places.observer.then(null, null, () => {
            MapDrawing.drawPlaces($scope.map, Places.get(), $scope.select);
        });

        Monsters.observer.then(null, null, () => {
            MapDrawing.drawMonsters($scope.map, Monsters.get(), $scope.select);
        });

        Player.observer.then(null, null, () => {
            $scope.player = Player.get();
            if($scope.player.homepoint.lat !== $scope.curHomepoint.lat || $scope.player.homepoint.lon !== $scope.curHomepoint.lon) {
                $scope.homepoint = $scope.player.homepoint;
                MapDrawing.drawHomepoint($scope.map, $scope.homepoint);
            }
        });
    }
);