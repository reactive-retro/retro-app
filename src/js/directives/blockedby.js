angular.module('retro').directive('blockedBy', (BlockState) => {
    return {
        restrict: 'A',
        link: ($scope, element, attrs) => {
            $scope.$parent.$watch(() => BlockState.get()[attrs.blockedBy], (newVal) => {
                element.prop('disabled', newVal);
            });
        }
    };
});