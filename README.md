# Reactive Retro App

The Ionic app that runs the game.


# Setup

* Install node v4.2.2
* `npm install -g gulp ionic bower` to get the basic dependencies needed.
* Create an alias to localhost in your `/etc/hosts` or equivalent called `retro` (this will allow you to use auth0 to auth to the game using a simple alias, instead of an IP).
* `npm install && bower install` to get the dependencies
* Edit `src/js/_init/config.js` to have your current IP (this can be obtained from the server after running it as well)
* `gulp` will watch the source files and update the distribution files
* `ionic serve` will serve the current application in your web browser. This will also watch for files written by `gulp`, so the two need to be running simultaneously.