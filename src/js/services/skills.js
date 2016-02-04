angular.module('retro').service('Skills', ($q) => {

    const defer = $q.defer();

    let skills = [];

    const getNewSkills = (newSkills) => {
        skills = newSkills;
        defer.notify(skills);
    };

    return {
        observer: defer.promise,
        set: getNewSkills,
        get: () => skills
    };
});