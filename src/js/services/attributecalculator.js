angular.module('retro').service('AttributeCalculator', (Player, Traits, Dice) => {

    const displayData = (effectName) => {
        switch(effectName) {
            case 'Heal':        return { chance: { value: () => 100 }, string: 'HP' };
            case 'Refresh':     return { chance: { value: () => 100 }, string: 'MP' };
            default:            return { chance: { value: () => 100 }, string: 'round' };
        }
    };

    const goodEffects = ['Regenerate', 'Stealth'];
    const badEffects  = ['Blind', 'Burn', 'Freeze', 'Shock', 'Stun'];

    const applyBoostAndMultiplier = (base, { boost = 0, multiplier = 1 }) => {
        return Math.floor((base + boost) * multiplier);
    };

    const isModified = ({ boost, multiplier }) => multiplier !== 1 || boost !== 0;

    const modifySkillBasedOnTraits = (skillRef) => {
        const traits = Traits.get();
        const myTraits = _.map(_.compact(Player.get().traits), traitName => _.find(traits, { traitName }));

        const skill = _.cloneDeep(skillRef);

        _.each(myTraits, trait => {
            if(!_.contains(skill.spellFamily, trait.traitFamily)) return;

            _.each(trait.traitEffects, (traitEffect, traitKey) => {

                if(traitEffect.effect) {
                    if(!skill.spellEffects[traitKey]) skill.spellEffects[traitKey] = {};
                    const thisEffect = traitEffect.effect;
                    const copyEffect = skill.spellEffects[traitKey];

                    if(!copyEffect.chance) copyEffect.chance = 0;
                    if(!copyEffect.roll)   copyEffect.roll = '0';
                    copyEffect.string = thisEffect.roll ? '' : 'round';
                    copyEffect.chance += thisEffect.chance || 0;
                    copyEffect.roll   += `+ ${thisEffect.duration || thisEffect.roll || 0}`;

                    copyEffect.effectDisplay = traitEffect.effectDisplay;

                    copyEffect.traitModified = true;
                }

                if(!skill.traitMods) skill.traitMods = {};

                _.each(['damage', 'hitchance', 'cooldown', 'duration', 'cost'], type => {
                    if(!traitEffect[type]) return;
                    if(!skill.traitMods[type]) skill.traitMods[type] = { multiplier: 1, boost: 0 };
                    const copyDamage = skill.traitMods[type];
                    copyDamage.multiplier += traitEffect[type].multiplier || 0;
                    copyDamage.boost += traitEffect[type].boost || 0;
                });
            });
        });

        const cooldownMod = _.get(skill, 'traitMods.cooldown', { multiplier: 1, boost: 0 });
        const costMod     = _.get(skill, 'traitMods.cost',     { multiplier: 1, boost: 0 });

        skill.spellCooldown = applyBoostAndMultiplier(skill.spellCooldown, cooldownMod);
        skill.spellCost     = applyBoostAndMultiplier(skill.spellCost, costMod);

        skill.cooldownTraitModified = isModified(cooldownMod);
        skill.costTraitModified = isModified(costMod);

        return skill;
    };

    return {
        modifySkill: modifySkillBasedOnTraits,
        applyBoostAndMultiplier: applyBoostAndMultiplier,
        getEffectColor: (effectName) => {
            if(_.contains(effectName, '+') || _.contains(goodEffects, effectName)) return 'icon-beneficial';
            if(_.contains(effectName, '-') || _.contains(badEffects, effectName))  return 'icon-detrimental';
            return '';
        },
        getEffectIcon: (effectName) => effectName.toLowerCase().split('-').join('-minus').split('+').join('-plus'),
        traitEffects: (trait) => trait.traitEffects,
        itemEffects: (item) => {
            return _.map(item.effects, effect => ({
                name: effect.name,
                displayData: {
                    min: { value: () => effect.statBuff || effect.duration, display: true },
                    max: { value: () => effect.statBuff || effect.duration, display: false },
                    chance: { value: () => 100 }
                },
                value: { min_possible: effect.statBuff || effect.duration, max_possible: effect.statBuff || effect.duration },
                extra: displayData(effect.name)
            }));
        },
        skillEffects: (skillRef, useAccuracy = true) => {
            const me = Player.get();

            return _(skillRef.spellEffects)
                .keys()
                .map(key => {
                    const effectData = skillRef.spellEffects[key];
                    const roll = effectData.roll;
                    const stats = roll ? Dice.statistics(roll, me.stats, 1) : null;

                    const retVal = { name: key, value: stats, extra: effectData };
                    retVal.accuracy = useAccuracy ? me.stats.acc : 0;

                    const modData = _.get(skillRef, effectData.string === 'round' ? 'traitMods.duration' : 'traitMods.damage', { multiplier: 1, boost: 0 });
                    const hitModData = _.get(skillRef, 'traitMods.hitchance', { multiplier: 1, boost: 0 });

                    retVal.displayData = {
                        effectDisplay: { value: effectData.effectDisplay, traitModified: effectData.traitModified },

                        min:    { value: (multiplier) => stats ? applyBoostAndMultiplier(stats.min_possible * multiplier, modData) : '',
                                  display: stats && stats.min_possible > 0,
                                  traitModified: isModified(modData) },

                        max:    { value: (multiplier) => stats ? applyBoostAndMultiplier(stats.max_possible * multiplier, modData) : '',
                                  display: stats ? stats.min_possible !== stats.max_possible : false,
                                  traitModified: isModified(modData) },

                        chance: { value: () => applyBoostAndMultiplier(effectData.chance + retVal.accuracy, hitModData),
                                  traitModified: isModified(hitModData)  }
                    };

                    return retVal;
                })
                // Damage always comes first
                .sortBy((obj) => obj.name === 'Damage' ? '*' : obj.name)
                .value();
        }
    };
});
