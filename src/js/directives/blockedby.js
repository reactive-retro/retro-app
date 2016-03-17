angular.module('retro').directive('blockedBy', ($timeout, BlockState) => {
    return {
        restrict: 'A',
        link: ($scope, element, attrs) => {
            $scope.$parent.$watch(() => BlockState.get()[attrs.blockedBy], (newVal) => {
                $timeout(() => element.prop('disabled', newVal));
            });
        }
    };
});