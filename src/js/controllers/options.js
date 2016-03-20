angular.module('retro').controller('OptionsController',
    ($scope, Options, OptionsFlow) => {

        $scope.isVisible = (option) => {
            if(!option.visibleIf) return true;
            return _.all(option.visibleIf, varObj => $scope.playerOptions[varObj.varName] === varObj.checkVal);
        };

        $scope.toggleOption = (option) => {
            const newVal = $scope.playerOptions[option.variable];
            const setting = { [option.variable]: newVal };

            if(option.auxOnSet) {
                _.each(option.auxOnSet, auxOption => {
                    if(newVal !== auxOption.ifSelf) return;
                    setting[auxOption.varName] = auxOption.setVal;
                });
            }

            _.extend($scope.playerOptions, setting);
            OptionsFlow.changeMany(setting);
        };

        $scope.playerOptions = Options.get();

        $scope.allOptions = [
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
            },
            {
                type: 'toggle',
                label: 'Skip round results',
                variable: 'skipRoundResults'
            }
        ];
    }
);