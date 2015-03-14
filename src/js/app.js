angular.module('qson', ['ionic', 'ngCordova'])

    .run(['$ionicPlatform', function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }])

    .controller('AppController', [
        '$scope', '$cordovaBarcodeScanner', '$ionicPlatform', '$http',
        function($scope, $cordovaBarcodeScanner, $ionicPlatform, $http) {

            $scope.scanCode = function() {
                try {
                    $cordovaBarcodeScanner.scan().then(function(imageData) {
                        $scope.showSpinner = true;

                        $http.get(imageData.text)
                            .error(res => {
                                $scope.showSpinner = false;
                                $scope.info = {};
                                alert('Could not connect to the internet, or there was a server error: ' + res + '\nAttempted to load url '+imageData.text);
                            })
                            .then(res => {
                                $scope.showSpinner = false;
                                $scope.info = res.data;
                            });

                    }, function(error) {
                        $scope.showSpinner = false;
                        alert('There was an error processing this code.');
                    });

                // no cordova
                } catch(e) {
                    $scope.showSpinner = false;
                    $scope.defaultData();
                }
            };

            $scope.defaultData = function() {
                $http.get('http://kurea.link:9001/person/1')
                    .then(res => $scope.info = res.data );
            };

            $ionicPlatform.ready(function() {
                $scope.scanCode();

                $scope.info = {
                    display: []
                };

                $scope.showSpinner = false;
            });
    }]);