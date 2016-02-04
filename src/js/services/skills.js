angular.module('retro').service('Skills', ($q, socket) => {
    //var clamp = (min, cur, max) => Math.max(min, Math.min(max, cur));

    const defer = $q.defer();

    let skills = [];

    const getNewSkills = (player) => {
        socket.emit('getskills', { name: player.name }, (err, res) => {
            if(!res || !res.skills) {
                skills = [];
            } else {
                skills = res.skills;
            }
            defer.notify(skills);
        });
    };

    return {
        observer: defer.promise,
        update: getNewSkills,
        get: () => skills
    };
});