angular.module('retro').service('BattleFlow', (Player, Battle, Toaster, BlockState, $stateWrapper, socket) => {

    const start = (monster) => {
        BlockState.block('Battle');
        const monsters = monster.monsters ? monster.monsters : [monster];
        socket.emit('combat:enter', { name: Player.get().name, monsters }, Toaster.handleDefault(() => {
            BlockState.unblock('Battle');
        }));
    };

    const confirmAction = ({ origin, id, skill, itemName }) => {
        socket.emit('combat:confirmaction', { skill, itemName, target: id, name: origin }, Toaster.swallow(() => {
            BlockState.unblock('Battle');
        }));
    };

    const toExplore = () => {
        $stateWrapper.noGoingBack('explore');
    };

    const getMultiplier = (skill, me) => _.filter(me.skills, check => check === skill).length;

    const skillCooldown = (skill, me) => getMultiplier(skill ? skill.spellName : '', me) * (skill ? skill.spellCooldown : 0);
    const canCastSkillCD = (skill, me) => {
        const skillName = skill ? skill.spellName : '';
        return !me.cooldowns[skillName] || me.cooldowns[skillName] <= 0;
    };

    const skillCost = (skill, me) => getMultiplier(skill ? skill.spellName : '', me) * (skill ? skill.spellCost : 0);
    const canCastSkillMP = (skill, me) => skillCost(skill, me) <= me.stats.mp.__current;

    return {
        start,
        confirmAction,
        toExplore,
        getMultiplier,
        skillCooldown,
        canCastSkillCD,
        skillCost,
        canCastSkillMP
    };
});