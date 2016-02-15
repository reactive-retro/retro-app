angular.module('retro').directive('map', (MAP_STYLE, Toaster, Google) => {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&',
            onClick: '&'
        },
        link: ($scope, $element) => {

            if(!Google || !Google.maps) {
                Toaster.show('Could not reach google.');
                return;
            }

            // this is the available list of places in the game
            const init = () => {
                const mapOptions = {
                    center: new Google.maps.LatLng(32.3078, -64.7505),
                    zoom: 17,
                    mapTypeId: Google.maps.MapTypeId.ROADMAP,
                    draggable: true,
                    minZoom: 15,
                    maxZoom: 17,
                    styles: MAP_STYLE,
                    mapTypeControlOptions: { mapTypeIds: [] },
                    overviewMapControl: false,
                    streetViewControl: false,
                    zoomControl: false
                };

                const map = new Google.maps.Map($element[0], mapOptions);

                $scope.onCreate({ map: map });

                Google.maps.event.addDomListener($element[0], 'mousedown', (e) => {
                    $scope.onClick();
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