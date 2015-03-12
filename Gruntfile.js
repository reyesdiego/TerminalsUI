module.exports = function(grunt) {

	grunt.initConfig({
		concat: {           //Step 1
			css: {            //Step 2
				src: [
					'css/angucomplete-alt.css',
					'css/angular-multi-select.css',
					'css/animation.css'
				],
				dest: 'build/css/aditional.css'
			},
			controller : {
				src : [
					'controller/*'
				],
				dest : 'build/controller/controllers.js'
			},
			factory : {
				src : [
					'factory/*'
				],
				dest : 'build/factory/factorys.js'
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-concat'); //Step 3

	// Default task(s).
	grunt.registerTask('default', ['concat:css','concat:controller','concat:factory']);  //Step 4
};
