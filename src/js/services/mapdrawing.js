angular.module('retro').service('MapDrawing', (Google, Settings, MAP_COLORS) => {

    const savedPlaces = [];
    const savedMonsters = [];
    let curPos = {};
    let homepoint = null;
    let miasma = null;

    const MAX_VIEW_RADIUS = Settings.RADIUS; // meters

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
        const d2r = Math.PI / 180;   // degrees to radians
        const r2d = 180 / Math.PI;   // radians to degrees
        const earthsradius = 3963; // 3963 is the radius of the earth in miles
        const points = 32;

        // find the radius in lat/lon - convert meters to miles
        const rlat = (radius*0.000621371192 / earthsradius) * r2d;
        const rlng = rlat / Math.cos(point.lat() * d2r);

        const start = points+1;
        const end = 0;

        const extp = [];

        for (let i=start; i>end; i--) {
            const theta = Math.PI * (i / (points/2));
            const ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
            const ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
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

    const containsMonster = (bounds, pos) =>  bounds.contains(pos);

    const refreshMonsters = (map) => {
        const bounds = map.getBounds();
        _.each(savedMonsters, monsterMarker => {
            const contains = containsMonster(bounds, monsterMarker.position);
            if(contains && monsterMarker.map || !contains && !monsterMarker.map) return;
            monsterMarker.setMap(contains ? map : null);
        });
    };

    const drawMonsters = (map, monsters, click = () => {}) => {
        const bounds = map.getBounds();

        _.each(savedMonsters, monster => monster.setMap(null));
        _.each(monsters, monster => {

            const pos = new Google.maps.LatLng(monster.location.lat, monster.location.lon);

            const monsterMarker = new Google.maps.Marker({
                position: pos,
                map: bounds && containsMonster(bounds, pos) ? map : null,
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
                    content: `${monster.name}<br>
                    Class: ${monster.profession}<br>
                    Rating: ${monster.rating > 0 ? '+' : ''}${monster.rating}
                    `
                });

                infoWindow.open(map, monsterMarker);

                click({ monster, infoWindow });
            });

            savedMonsters.push(monsterMarker);
        });
    };

    const drawHomepoint = (map, coords) => {
        const homepointCenter = new Google.maps.LatLng(coords.lat, coords.lon);

        if(homepoint) {
            homepoint.setMap(null);
        }

        homepoint = new Google.maps.Marker({
            position: homepointCenter,
            map: map,

            // no clicking this marker
            clickable: false,
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

        if(miasma) {
            miasma.setMap(null);
        }

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

    const drawMe = (map, coords, onclick = () => {}) => {
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

        curPos.addListener('click', onclick);

        const affectRadius = new Google.maps.Circle({
            fillColor: MAP_COLORS.heroRadius.fill,
            strokeColor: MAP_COLORS.heroRadius.outline,
            strokeWeight: 1,
            radius: 50,
            map: map
        });

        affectRadius.bindTo('center', curPos, 'position');
    };

    const addMapEvents = (map, dragCallback = () => {}) => {
        let lastValidCenter = null;

        Google.maps.event.addListener(map, 'drag', dragCallback);

        Google.maps.event.addListener(map, 'idle', refreshMonsters.bind(null, map));

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