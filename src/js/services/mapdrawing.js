angular.module('retro').service('MapDrawing', (Google, Settings, MAP_COLORS) => {

    const savedPlaces = [];
    const savedMonsters = [];
    let curPos = {};
    let homepoint = {};
    let miasma = {};

    const MAX_VIEW_RADIUS = Settings.RADIUS; //meters

    const bounds = new Google.maps.LatLngBounds();

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

    const drawPlaces = (map, places) => {
        _.each(savedPlaces, place => place.setMap(null));
        _.each(places, place => {
            savedPlaces.push(new Google.maps.Marker({
                position: place.geometry.location,
                map: map,
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

    const drawMonsters = (map, monsters, click = () => {}) => {
        _.each(savedMonsters, monster => monster.setMap(null));
        _.each(monsters, monster => {
            const monsterMarker = new Google.maps.Marker({
                position: new Google.maps.LatLng(monster.location.lat, monster.location.lon),
                map: map,
                icon: {
                    path: Google.maps.SymbolPath.CIRCLE,
                    strokeColor: MAP_COLORS.monster.outline,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: MAP_COLORS.monster.fill,
                    fillOpacity: 1,
                    scale: 5
                }
            });

            monsterMarker.addListener('click', () => {

                const infoWindow = new Google.maps.InfoWindow({
                    content: monster.name
                });

                infoWindow.open(map, monsterMarker);

                click({ monster, infoWindow });
            });

            savedMonsters.push(monsterMarker);
        });
    };

    const drawHomepoint = (map, coords) => {
        const homepointCenter = new Google.maps.LatLng(coords.lat, coords.lon);

        homepoint = new Google.maps.Marker({
            position: homepointCenter,
            map: map,
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
            map: map,
            paths: [mercatorWorldBounds, drawCircle(homepointCenter, MAX_VIEW_RADIUS)]
        };

        miasma = new Google.maps.Polygon(miasmaOptions);

    };

    const drawMe = (map, coords) => {
        curPos = new Google.maps.Marker({
            position: new Google.maps.LatLng(coords.latitude, coords.longitude),
            map: map,
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
            map: map
        });

        affectRadius.bindTo('center', curPos, 'position');
    };

    const addMapEvents = (map, dragCallback = () => {}) => {
        var lastValidCenter = null;

        Google.maps.event.addListener(map, 'drag', dragCallback);

        Google.maps.event.addListener(map, 'center_changed', () => {
            if (bounds.contains(map.getCenter())) {
                lastValidCenter = map.getCenter();
                return;
            }

            map.panTo(lastValidCenter);
        });
    };

    const setCurrentPosition = (pos) => curPos.setPosition(pos);

    return {
        addMapEvents,
        drawPlaces,
        drawHomepoint,
        drawMe,
        drawMonsters,

        setCurrentPosition
    };
});