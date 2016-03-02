angular.module('retro').directive('map', ($window, $document, MAP_STYLE, Toaster, Google) => {
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
                    minZoom: 14,
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

                Google.maps.event.addListenerOnce(map, 'idle', () => {

                    // Prevent anchors in google maps from breaking app by launching these anchors using InAppBrowser
                    const googleMap = $document[0].getElementById('map');
                    const anchors = googleMap.getElementsByTagName('a');
                    _.each(anchors, anchor => {
                        anchor.addEventListener('click', (e) => {
                            e.preventDefault();
                            $window.open(anchor.href, '_blank', 'location=no');
                        });
                    });
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