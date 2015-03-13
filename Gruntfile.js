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
					'controller/*',
					'directives/*',
					'factory/*',
					'filter/*',
					'includes/js/utils/configProd.js',
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
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['concat:css','concat:js', 'cssmin:css', 'uglify:js']);
};
