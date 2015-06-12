angular.module('retro').directive('map', (MAP_STYLE) => {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: ($scope, $element) => {
            var init = () => {
                const mapOptions = {
                    center: new google.maps.LatLng(32.3078, -64.7505),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    draggable: false,
                    minZoom: 13,
                    maxZoom: 19,
                    styles: MAP_STYLE,
                    mapTypeControlOptions: {mapTypeIds: []},
                    overviewMapControl: false,
                    streetViewControl: false
                };

                var map = new google.maps.Map($element[0], mapOptions);

                $scope.onCreate({map: map});

                google.maps.event.addDomListener($element[0], 'mousedown', (e) => {
                    e.preventDefault();
                    return false;
                });
            };

            if (document.readyState === 'complete') {
                init();
            } else {
                google.maps.event.addDomListener(window, 'load', init);
            }
        }
    };
});