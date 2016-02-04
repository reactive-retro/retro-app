angular.module('retro').service('Places', ($q) => {

    const defer = $q.defer();

    let places = [];

    const updatePlaces = (newPlaces) => {
        places = newPlaces;
        defer.notify(places);
    };

    return {
        observer: defer.promise,
        apply: () => {
            defer.notify(places);
        },
        set: updatePlaces,
        get: () => places
    };
});