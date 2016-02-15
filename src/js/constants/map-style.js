angular.module('retro').constant('MAP_STYLE', [
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            { visibility: 'on' },
            { color: '#aee2e0' }
        ]
    },
    {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#abce83' }
        ]
    },
    {
        featureType: 'poi',
        stylers: [
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
            { visibility: 'simplified' },
            { color: '#8dab68' }
        ]
    },
    {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
            { visibility: 'simplified' }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
            { color: '#5B5B3F' }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
            { color: '#ABCE83' }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [
            { color: '#A4C67D' }
        ]
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
            { color: '#9BBF72' }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
            { color: '#EBF4A4' }
        ]
    },
    {
        featureType: 'transit',
        stylers: [
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
            { visibility: 'on' },
            { color: '#87ae79' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#7f2200' },
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
            { color: '#ffffff' },
            { visibility: 'on' },
            { weight: 4.1 }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
            { color: '#495421' }
        ]
    },
    {
        featureType: 'administrative.neighborhood',
        elementType: 'labels',
        stylers: [
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'administrative.locality',
        elementType: 'labels',
        stylers: [
            { visibility: 'off' }
        ]
    }
]);