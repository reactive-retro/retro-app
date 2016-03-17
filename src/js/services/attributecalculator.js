angular.module('retro').service('AttributeCalculator', (Player, Dice) => {

    const displayString = (effectName) => {
        switch(effectName) {
            case 'Heal': return { string: 'HP' };
            case 'Refresh': return { string: 'MP' };
            default: return { string: effectName.split('+').join('').split('-').join(''), pluralize: false };
        }
    };

    return {
        itemEffects: (item) => {
            return _.map(item.effects, effect => ({
                name: effect.name,
                value: { min_possible: effect.statBuff, max_possible: effect.statBuff },
                extra: displayString(effect.name)
            }));
        },
        skillEffects: (skillRef, useAccuracy = true) => {
            const me = Player.get();
            return _(skillRef.spellEffects)
                .keys()
                .map(key => {
                    const roll = skillRef.spellEffects[key].roll;
                    const stats = roll ? Dice.statistics(roll, me.stats, 1) : null;

                    const retVal = { name: key, value: stats, extra: skillRef.spellEffects[key] };
                    if(useAccuracy) retVal.accuracy = me.stats.acc;

                    return retVal;
                })
                // Damage always comes first
                .sortBy((obj) => obj.name === 'Damage' ? '*' : obj.name)
                .value();
        }
    };
});
