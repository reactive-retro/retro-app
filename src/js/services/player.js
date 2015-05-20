angular.module('retro').service('Player', () => {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    var player = {
        name: 'Seiyria',
        unlockedProfessions: ['Cleric', 'Fighter', 'Mage'],
        professionLevels: {
            Fighter: {
                level: 1
            }
        },
        stats: {
            profession: 'Fighter',
            str: 10,
            agi: 10,
            int: 10,
            luk: 1,

            gold: 100,
            xp: {
                cur: 100,
                max: 1000
            },
            hp: {
                cur: 100,
                max: 1000
            },
            mp: {
                cur: 300,
                max: 500
            }
        },
        equipment: {
            equip: (item) => this[item.type] = item,
            weapon: {
                type: 'weapon',
                name: 'Knife',
                stats: {
                    str: 1,
                    int: -1
                }
            },
            armor: {
                type: 'armor',
                name: 'Shirt',
                weight: 1,
                stats: {
                    agi: 2
                }
            },
            item: {
                type: 'item',
                name: 'Health Potion'
            }
        },
        inventory: [
            {
                type: 'weapon',
                name: 'Dagger',
                stats: {
                    str: 2
                }
            },
            {
                type: 'weapon',
                name: 'Club',
                stats: {
                    str: 3,
                    agi: -1
                }
            },
            {
                type: 'weapon',
                name: 'Staff',
                stats: {
                    int: 2
                }
            },
            {
                type: 'weapon',
                name: 'Main Gauche',
                stats: {
                    str: 2,
                    agi: 1
                }
            },
            {
                type: 'weapon',
                name: 'Glaive',
                stats: {
                    str: 2,
                    agi: 4
                }
            },
            {
                type: 'armor',
                name: 'Chainmail',
                weight: 2,
                stats: {
                    agi: 3,
                    str: 1
                }
            },
            {
                type: 'armor',
                name: 'Fullplate',
                weight: 3,
                stats: {
                    agi: -3,
                    str: 4
                }
            }
        ]
    };

    return player;
});