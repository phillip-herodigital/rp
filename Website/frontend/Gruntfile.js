module.exports = function(grunt) {
 
	grunt.registerTask('watch', [ 'watch' ]);
	grunt.registerTask('compass', [ 'compass:dist' ]);
	grunt.registerTask('default', [ 'compass:dist', 'watch' ]);
	grunt.registerTask('img', [ 'image_resize', 'compass:clean', 'compass:dist' ]);
 
	grunt.initConfig({
		watch: {
			html: {
				files: ['{,*/}*.html'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: ['assets/js/*.js'],
				options: {
					livereload: true,
				}
			},
			css: {
				files: ['assets/css/global.css'],
				options: {
					livereload: true,
				},
				tasks: ['csssplit']
			},
			sass: {
				files: ['**/*.scss'],
				tasks: ['compass:dist']
			},
		},
		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			},
			clean: {
				options: {
					config: 'config.rb',
					clean: true
				}
			}
		},
		image_resize: {
			options: {
				width: "50%",
				height: "50%",
				overwrite: grunt.option('overwrite') || false
			},
			dev: {
				files: [{
					expand: true,
					src: ['**/*.{jpg,gif,png}'],
					cwd: 'assets/i/icon2x',
					dest: 'assets/i/icon'
				},
				{
					expand: true,
					src: ['**/*.{jpg,gif,png}'],
					cwd: 'assets/i/bg2x',
					dest: 'assets/i/bg'
				}]
			}
		},
		csssplit: {
		    dev: {
		    	expand: true,
    			cwd: 'assets/css',
				src: ['global.css'],
				dest: 'assets/css',
				options: {
					maxSelectors: 4095,
		            suffix: '_'
		        }
			},
		},
	});
 
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-image-resize');
	grunt.loadNpmTasks('grunt-csssplit');
 
};
