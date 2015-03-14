angular.module('qson')

    .directive('text', function() {
        return {
            scope: {
                item: '='
            },
            template: `
                <div>
                    <h2 ng-if="item.data">{{item.data}}</h2>
                    <p ng-if="item.subdata">{{item.subdata}}</p>
                </div>
            `,
            replace: true
        };
    })

    .directive('action', ['ACTION_ICONS', 'ACTION_HREF', function(actionIcons, actionHref) {
        return {
            scope: {
                item: '='
            },
            link: function(scope) {
                scope.actionIcons = actionIcons;
                scope.actionHref = actionHref;
            },
            template: `
                <a class="item item-icon-left assertive" target='_system' ng-href="{{actionHref[item.subtype]}}:{{item.subdata}}">
                    <i class="icon {{actionIcons[item.subtype]}}"></i>
                    {{item.data}}
                </a>
            `,
            replace: true
        };
    }])

    .directive('picture', function() {
        return {
            scope: {
                item: '='
            },
            template: `
                <img ng-src="data:image/{{item.subdata}};base64, {{item.data}}" />
            `,
            replace: true
        };
    });