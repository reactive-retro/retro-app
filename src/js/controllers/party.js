angular.module('retro').controller('PartyController',
    ($scope, $rootScope, Party, PartyFlow, Settings) => {
        $scope.partyFlow = PartyFlow;
        $scope.maxPartyMembers = Settings.MAX_PARTY_MEMBERS;

        const setParty = (party) => {
            $scope.party = party;
            if(party) {
                $rootScope.actionButton = { text: 'Leave', btnClass: 'button-warning', callback: PartyFlow.leave };
                $scope.party.updateChannel.watch(Party.set);
            } else {
                $rootScope.actionButton = null;
            }
        };

        setParty(Party.get());
        Party.observer.then(null, null, () => setParty(Party.get()));
    }
);