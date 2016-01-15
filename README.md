# Reactive Retro App

The Ionic app that runs the game.


# Setup

* Install node v4.2.2
* `npm install -g gulp ionic bower` to get the basic dependencies needed.
* Create an alias to localhost in your `/etc/hosts` or equivalent called `retro` (this will allow you to use auth0 to auth to the game using a simple alias, instead of an IP).
* `npm install && bower install` to get the dependencies
* Edit `src/js/_init/config.js` to have your current IP (this can be obtained from the server after running it as well)
* `npm start` will run `gulp` and `ionic serve` and open the app in your browser.