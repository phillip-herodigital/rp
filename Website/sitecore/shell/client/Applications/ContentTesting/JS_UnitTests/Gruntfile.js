
module.exports = function (grunt) {
  
  grunt.initConfig({

		meta: {
			package: grunt.file.readJSON('package.json'),
			bin: {
				coverage: 'bin/coverage'
			}
		},

		//jshint: {
		//  // define the files to lint
		//  files: ['configRequire.js'],
		//  // configure JSHint (documented at http://www.jshint.com/docs/)
		//  options: {
		//    // more options here if you want to override JSHint defaults
		//    globals: {
		//      jQuery: true,
		//      console: true,
		//      module: true
		//    }
		//  }
	  //},

		jasmine: {

			coverage: {
			  //src: ['../Components/SliderAdvanced/SliderAdvanced.js'],
			  //src: ['../ContentTesting/Components/ProgressBarCustom/ProgressBarCustom.js'],
			  //src: ['../ContentTesting/Components/_coverage/*/*.js'],
			  //src: ['../ContentTesting/Components/_coverage/ExperienceIndicator/ExperienceIndicator.js'],
			  //src: ['../ContentTesting/Components/_coverage/*/*[^.t].js'],
			  //src: ['../Components/CarouselImage/CarouselImage.js'],
			  //src: ['../Components/_coverage/*/*.js'],
			  src: ['../Components/*/*.js'],
        
			  
				options: {
				  //specs: ['../Components/SliderAdvanced/test/SliderAdvanced.test.js'],
				  //specs: ['../ContentTesting/Components/_coverage/**/test/*.test.js'],
				  //specs: ['../ContentTesting/Components/_coverage/ExperienceIndicator/test/ExperienceIndicator.test.js'],
				  //specs: ['../Components/CarouselImage/test/CarouselImage.test.js'],
				  //specs: ['../Components/_coverage/**/test/*.test.js'],
				  specs: ['../Components/**/test/*.test.js'],
				  
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: '<%= meta.bin.coverage %>/coverage.json',
						report: [
							{
								type: 'html',
								options: {
									dir: '<%= meta.bin.coverage %>/html'
								}
							},
							{
								type: 'text-summary'
							}
						],
						template: require('grunt-template-jasmine-requirejs'),
						templateOptions: {
							requireConfig: {
							  //mainConfigFile: './configLaunch.js',
							  //baseUrl: "./",
							  //name: "configLaunch",
							  //include: ['./configLaunch.js'],
							  //out: './main.min.js'

							  requireConfigFile: './configLaunch.js'
							}
					  }

					},

					
				}
			},

		},

		//requirejs: {
		//  compile: {
		//    options: {
		//      //mainConfigFile: './configLaunch.js',
		//      baseUrl: "./",
		//      name: "configLaunch",
		//      include: ['configLaunch'],
		//      out: './main.min.js'
		//    }
		//  }
		//},

	});
	
  
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-template-jasmine-requirejs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	
  grunt.registerTask('test:coverage', ['jasmine:coverage' ]);
  //grunt.registerTask('test:coverage', ['jshint']);
  //grunt.registerTask('test2', ['requirejs', 'jasmine:coverage' ]);
	
};

