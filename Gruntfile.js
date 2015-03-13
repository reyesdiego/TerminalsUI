module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			css: {
				src: [
					'css/angucomplete-alt.css',
					'css/angular-multi-select.css',
					'css/animation.css'
				],
				dest: 'build/css/aditional.css'
			},
			js : {
				src : [
					'main/*',
					'includes/js/utils/configProd.js',
					'controller/*',
					'directives/*',
					'factory/*',
					'filter/*',
					'service/*'
				],
				dest : 'build/js/app.js'
			}
		},
		cssmin: {
			css: {
				src: 'build/css/aditional.css',
				dest: 'build/css/aditional-min.css'
			}
		},
		uglify: {
			js: {
				files: {
					'build/js/app-min.js' : ['build/js/app.js']
				}
			}
		},
		processhtml: {
			dist: {
				files: {
					'build/index.html' : 'index.html'
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-processhtml');

	// Default task(s).
	grunt.registerTask('default', ['concat:css','concat:js', 'cssmin:css', 'uglify:js', 'processhtml:dist']);
};
