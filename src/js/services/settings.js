angular.module('retro').service('Settings', (Config) => ({
    isProd: () => Config._cfg === 'PROD'
}));