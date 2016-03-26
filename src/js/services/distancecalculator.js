angular.module('retro').service('DistanceCalculator', () => {
    return {
        simple: (x1, x2, y1, y2) => {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        },
        gps: (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const toRad = (num) => num * (Math.PI / 180);

            const dLat = toRad(lat2-lat1);
            const dLon = toRad(lon2-lon1);

            lat1 = toRad(lat1);
            lat2 = toRad(lat2);

            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) *
                Math.cos(lat1) * Math.cos(lat2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            return R * c;
        }
    };
});
