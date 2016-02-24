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
            const newVal = $scope.settings[option.variable];
            const setting = { [option.variable]: newVal };

            if(option.auxOnSet) {
                _.each(option.auxOnSet, auxOption => {
                    if(newVal !== auxOption.ifSelf) return;
                    setting[auxOption.varName] = auxOption.setVal;
                });
            }

            _.extend($scope.settings, setting);
            SettingFlow.changeMany(setting);
        };

        $scope.settings = Settings.get();

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
                    setVal: false,
                    varName: 'autoConfirmAttacksIfOnly',
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