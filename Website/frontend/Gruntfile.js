module.exports = function(grunt) {
 
	grunt.registerTask('watch', [ 'watch' ]);
	grunt.registerTask('compass', [ 'compass' ]);
	grunt.registerTask('default', [ 'compass', 'watch' ]);
	grunt.registerTask('img', [ 'image_resize' ]);
 
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
				files: ['assets/css/*.css'],
				options: {
					livereload: true,
				}
			},
			sass: {
				files: ['**/*.scss'],
				tasks: ['compass']
			}
		},
		compass: {
			dist: {
				options: {
					config: 'config.rb'
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
		}
	});
 
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-image-resize');
 
};