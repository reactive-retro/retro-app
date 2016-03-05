angular.module('retro').config(($localStorageProvider) => {
    $localStorageProvider.setKeyPrefix(ionic.Platform.platform());
});