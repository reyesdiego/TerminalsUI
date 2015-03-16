module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			css: {
				src: [
					'css/angucomplete-alt.css',
					'css/angular-multi-select.css',
					'css/animation.css',
					'css/dialogs.css'
				],
				dest: 'build/css/aditional.css'
			},
			js : {
				src : [
					'includes/js/utils/configProd.js',
					'main/*',
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
			},
			bactssa: {
				src: 'css/bootstrap.cerulean.css',
				dest: 'build/css/bootstrap.cerulean.css'
			},
			terminal4: {
				src: 'css/bootstrap.united.css',
				dest: 'build/css/bootstrap.united.css'
			},
			trp: {
				src: 'css/bootstrap.flaty.css',
				dest: 'build/css/bootstrap.flaty.css'
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
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						src: ['bower_components/**'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['fonts/*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['images/*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['js/*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['view/*'],
						dest: 'build'
					}
				]
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-processhtml');

	// Default task(s).
	grunt.registerTask('default', [
		'concat:css',
		'concat:js',
		'cssmin:css',
		'cssmin:bactssa',
		'cssmin:terminal4',
		'cssmin:trp',
		'uglify:js',
		'processhtml:dist',
		'copy:main'
	]);
};
