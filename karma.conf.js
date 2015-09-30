// Karma configuration
// Generated on Tue Sep 29 2015 13:35:41 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
		'js/html5.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-cookies/angular-cookies.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/angular-cache/dist/angular-cache.js',
		'bower_components/angular-ui-router/release/angular-ui-router.js',
		'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
		'bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
		'js/moment-with-locales.min.js',
		'bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js',
		'bower_components/angular-socket-io/socket.js',
		'js/angular-notify/angular-notify.js',
		'js/socket.io.min.js',
		'js/angular-locale_es-ar.js',
		'js/jsapi.js',
		'node_modules/angular-mocks/angular-mocks.js',
		'includes/js/utils/config.js',
		'main/main.js',
		'service/*.js',
		'factory/*.js',
		'filter/filters.js',
		'controller/*.js',
		'directives/*.js',
		'js/linq.min.js',
		'tests/*js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
