angular.module('retro').controller('OptionsController',
    ($scope, Settings, SettingFlow) => {

        $scope.changeSetting = (key, val) => {
            SettingFlow.change({ setting: key, newVal: val });
        };

        $scope.isVisible = (option) => {
            if(!option.visibleIf) return true;
            return _.all(option.visibleIf, varObj => $scope.settings[varObj.varName] === varObj.checkVal);
        };

        $scope.toggleSetting = (option) => {
            console.log(option);
        };

        $scope.settings = Settings.get();
        Settings.observer.then(null, null, () => $scope.settings = Settings.get());

        $scope.options = [
            {
                type: 'divider',
                label: 'Combat'
            },
            {
                type: 'toggle',
                label: 'Auto-confirm attacks',
                variable: 'autoConfirmAttacks',
                auxOnSet: [{
                    checkVal: false,
                    variables: ['autoConfirmAttacksIfOnly'],
                    ifSelf: false
                }]
            },
            {
                type: 'toggle',
                label: 'Auto-confirm only if last alive',
                variable: 'autoConfirmAttacksIfOnly',
                visibleIf: [{
                    checkVal: true,
                    varName: 'autoConfirmAttacks'
                }]
            }
        ];
    }
);