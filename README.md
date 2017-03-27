# Sonic's Flappy Adventure

A game made entirely with HTML5, CSS3 and JavaScript. Based on Flappy Bird.

Built on a supplied template from our teacher.

## Features

* Spacebar, click or tap to control Sonic
* Ground moves at the same speed as "pipes"
* Colliding with the ground and "pipes" results in death
* Collect rings to get points
    * Beat your own highscore!
* Start the game again by either clicking/tapping "Restart" or press spacebar
* Hardware accelerated elements
* Paralax clouds
* Sonic rotates based on his trajectory
* Sprite animations
    * Sonic has an idle animation and a flap animation
    * The rings have a rotation animation
* 8-bit style music and sound effects
    * Mute button in upper left corner
* Responsive landscape layout enables full mobile functionality
    * We tested on our phones. Works great
* Tested in Chrome and Safari
    * Works best in Chrome on mobile
    * Just works best in Chrome in general
* This swaggin readme

## Getting Started

In order to continue developing Sonic's Flappy Adventure on your own machine, you will need [node.js](https://nodejs.org/en/download/) in order to use npm to install the dependencies and run the server.

You will also need [Compass](http://compass-style.org/install/) in order to compile the Sass files to CSS.
It requires [Ruby](http://www.ruby-lang.org/en/downloads/) to run and install. We will not go into detail on how to do that here.

Note that it is possible to run th game without using Grunt. You will then just have to install the dependencies from from both NPM and Bower and open the index.html file in your web browser. This does result in the favicon being unable to load, but that is not important.

### Prerequisites

#### Grunt

Run the following command in order to install Grunt on your machine.

```
$ sudo npm install -g grunt
```

#### Bower

Run the following command in order to install Bower on your machine.

```
$ sudo npm install -g bower
```

#### Dependencies

Run the following commands in the SonicFlappyAdventure directory (the root directory of the project).

```
$ npm install
$ bower install
```

### Running Grunt

You simply call the following command in the root directory of the project in order to start up Grunt which will automatically compile the Sass files and JavaScript files on change.

```
$ grunt serve
```

Now the game is up and running on port 9000 by default.

## Development

We use Grunt as our task runner and build system.

### Built With
* [Grunt](https://gruntjs.com/) - Task runner
* [Sass](https://sass-lang.com/) - CSS preprocessor
* [The Spriters Resource](https://www.spriters-resource.com/) - Artwork
* [Freesound](https://www.freesound.org/) - Sound effects
* [Kevin MacLeod](http://incompetech.com/) - Music
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Bower](https://bower.io/) - Dependency Management

## Authors

* [Christian A. Jacobsen](https://github.com/ChristianJacobsen/)
* [Hilmar Tryggvason](https://github.com/Indexu/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details