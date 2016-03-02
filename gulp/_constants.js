

export const paths = {
    sass: ['./src/scss/**/*.scss'],
    jade: ['./src/jade/**/*.jade'],
    jsB:  ['./src/js/_init/app.js', './src/js/**/!(app)*.js'],
    js:   ['./src/js/**/*.js']
};

export const lib = [
    './www/lib/lodash/lodash.js',
    './www/lib/dice.js/build/dice.js',
    './www/lib/ionic/release/js/ionic.bundle.js',
    './www/lib/ngCordova/dist/ng-cordova.js',
    './www/lib/auth0-angular/build/auth0-angular.js',
    './www/lib/ngstorage/ngStorage.js',
    './www/lib/socketcluster-client/socketcluster.js',
    './www/lib/ng-cordova-oauth/ng-cordova-oauth.js',
    './www/lib/angular-jwt/dist/angular-jwt.js',
    './www/lib/auth0-lock/build/auth0-lock.js'
];