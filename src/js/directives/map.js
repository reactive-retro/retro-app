angular.module('retro').directive('map', (MAP_STYLE, $cordovaToast, Google) => {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: ($scope, $element) => {

            if(!Google || !Google.maps) {
                $cordovaToast.showLongBottom('Could not reach google.');
                return;
            }

            // TODO also hit google places for a 25mile radius once upon map creation
            // this is the available list of places in the game

            // TODO store a home point separate from login point, but when creating a character set it to their current location
            // make an option to let them set it to their current point
            var init = () => {
                const mapOptions = {
                    center: new Google.maps.LatLng(32.3078, -64.7505),
                    zoom: 17,
                    mapTypeId: Google.maps.MapTypeId.ROADMAP,
                    draggable: false,
                    minZoom: 17,
                    maxZoom: 17,
                    styles: MAP_STYLE,
                    mapTypeControlOptions: {mapTypeIds: []},
                    overviewMapControl: false,
                    streetViewControl: false,
                    zoomControl: false
                };

                var map = new Google.maps.Map($element[0], mapOptions);

                $scope.onCreate({map: map});

                Google.maps.event.addDomListener($element[0], 'mousedown', (e) => {
                    e.preventDefault();
                    return false;
                });
            };

            if (document.readyState === 'complete') {
                init();
            } else {
                Google.maps.event.addDomListener(window, 'load', init);
            }
        }
    };
});