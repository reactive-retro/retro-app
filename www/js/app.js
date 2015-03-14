"use strict";

angular.module("qson", ["ionic", "ngCordova"]).run(["$ionicPlatform", function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}]).controller("AppController", ["$scope", "$cordovaBarcodeScanner", "$ionicPlatform", "$http", function ($scope, $cordovaBarcodeScanner, $ionicPlatform, $http) {

    $scope.scanCode = function () {
        try {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                $scope.showSpinner = true;

                $http.get(imageData.text).error(function (res) {
                    $scope.showSpinner = false;
                    $scope.info = {};
                    alert("Could not connect to the internet, or there was a server error: " + res + "\nAttempted to load url " + imageData.text);
                }).then(function (res) {
                    $scope.showSpinner = false;
                    $scope.info = res.data;
                });
            }, function (error) {
                $scope.showSpinner = false;
                alert("There was an error processing this code.");
            });

            // no cordova
        } catch (e) {
            $scope.showSpinner = false;
            $scope.defaultData();
        }
    };

    $scope.defaultData = function () {
        $http.get("http://kurea.link:9001/person/1").then(function (res) {
            return $scope.info = res.data;
        });
    };

    $ionicPlatform.ready(function () {
        $scope.scanCode();

        $scope.info = {
            display: []
        };

        $scope.showSpinner = false;
    });
}]);
"use strict";

angular.module("qson").constant("ACTION_ICONS", {
    call: "ion-ios-telephone",
    email: "ion-ios-email"
}).constant("ACTION_HREF", {
    call: "tel",
    email: "mailto"
});
"use strict";

angular.module("qson").directive("text", function () {
    return {
        scope: {
            item: "="
        },
        template: "\n                <div>\n                    <h2 ng-if=\"item.data\">{{item.data}}</h2>\n                    <p ng-if=\"item.subdata\">{{item.subdata}}</p>\n                </div>\n            ",
        replace: true
    };
}).directive("action", ["ACTION_ICONS", "ACTION_HREF", function (actionIcons, actionHref) {
    return {
        scope: {
            item: "="
        },
        link: function link(scope) {
            scope.actionIcons = actionIcons;
            scope.actionHref = actionHref;
        },
        template: "\n                <a class=\"item item-icon-left assertive\" target='_system' ng-href=\"{{actionHref[item.subtype]}}:{{item.subdata}}\">\n                    <i class=\"icon {{actionIcons[item.subtype]}}\"></i>\n                    {{item.data}}\n                </a>\n            ",
        replace: true
    };
}]).directive("picture", function () {
    return {
        scope: {
            item: "="
        },
        template: "\n                <img ng-src=\"data:image/{{item.subdata}};base64, {{item.data}}\" />\n            ",
        replace: true
    };
});