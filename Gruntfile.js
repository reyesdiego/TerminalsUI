module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			css: {
				src: [
					'css/angucomplete-alt.css',
					'css/angular-multi-select.css',
					'css/animation.css',
					'css/dialogs.css',
					'css/notificaciones.css',
					'js/angular-notify/angular-notify.css'
				],
				dest: 'build/css/aditional.css'
			},
			js : {
				src : [
					'includes/js/utils/configProd.js',
					'js/angular-notify/angular-notify.js',
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
			},
			terminales: {
				src: 'css/terminalColor.css',
				dest: 'build/css/terminalColor.css'
			}
		},
		uglify: {
			js: {
				files: {
					'build/js/app-min.js' : ['build/js/app.js'],
					'js/angular-notify/angular-notify.min.js' : ['js/angular-notify/angular-notify.js']
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
						src: ['bower_components/angular/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-bootstrap-calendar/dist/css/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-bootstrap-calendar/dist/js/*-tpls.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular/angular-csp.css'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-cache/dist/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-cookies/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-sanitize/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-ui-bootstrap-bower/*-tpls.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-ui-router/release/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/bootstrap-ui-datetime-picker/dist/*.min.*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['bower_components/angular-socket-io/*.min.*'],
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
						src: ['js/**'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['view/*'],
						dest: 'build'
					},
					{
						expand: true,
						src: ['conversorPDF/**'],
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
		'cssmin:terminales',
		'uglify:js',
		'processhtml:dist',
		'copy:main'
	]);
};
