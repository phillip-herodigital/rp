# Stream Energy

## Requirements
- [Ruby] (https://www.ruby-lang.org/) – Used for RubyGems
	- [RubyGems] (http://rubygems.org/)
	  - [Bundler] (http://bundler.io/) – Used to load required versions of gems
	  - [Bower] (http://bower.io/) – Used to manage JS libraries
	- [Ruby DevKit] (http://rubyinstaller.org/add-ons/devkit/) – Needed for development on Windows platforms
- [Node.js] (http://nodejs.org/) – Used for Node modules
	- [NPM] (https://www.npmjs.org/)
		- [Grunt] (http://gruntjs.com/) – Used to run tasks
- [ImageMagick] (http://www.imagemagick.org/) – Used to handle image resizing within Grunt

## Setup
To install the necessary dependencies to build the frontend, you'll need to start by making sure you have all required build tools installed. To do this, run the following commands from this directory:

`bundle install` – this will install the necessary RubyGems, defined in the Gemfile
`npm install` – this will install the necessary Node modules, defined in the package.json file

### Gems
See Gemfile & Gemfile.lock

### Node Modules
See package.json

## Usage
A grunt file has been setup for this project which should be used to handle the Sass compilation.

Default command (watch directory for changes and run tasks, such as compass). This is what should be run for daily development.

`grunt`

A method has been created to resize images from the retina size to the non-retina size.

`grunt img` – Resizes images in bg2x and icon2x to 50% and saves to non-2x folders. Does not overwrite current images
`grunt img --overwrite` - Same as above, but overwrites all current non-retina images with the 2x version

Compass can be run through ruby rather than grunt (Node) if needed. 

`bundle exec compass` – Load required gems and compile compass