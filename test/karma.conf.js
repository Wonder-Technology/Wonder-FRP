// Karma configuration
// Generated on Wed Nov 05 2014 07:16:09 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'test/helper/*.js',
        'test/helper/jasmine/**',
        'test/helper/sinonJs/*.js',

        'dist/wdFrp.js',



        'test/unit/*Tool.js',
        'test/unit/**/*Tool.js',


        'test/unit/**',

        // 'test/unit/**/fromEventSpec.js',
        // 'test/unit/**/fromPromise*.js'

        // 'test/unit/**/doSpec.js',

        // 'test/unit/**/skipUntilSpec.js',
        // 'test/unit/**/dispose*.js',

        // 'test/unit/**/takeUntilSpec.js',
        // 'test/unit/**/flatMapSpec.js',
        // 'test/unit/**/concatMapSpec.js',
        // 'test/unit/**/merge*',

        // 'test/unit/**/filterSpec.js',

        //{pattern: 'dist/wdFrp.d.ts', watched: false, included: false, served: true},
        {pattern: 'dist/wdFrp.js.map', watched: false, included: false, served: true}
        // {pattern: 'src/**', watched: false, included: false, served: true}
    ],


    // list of files to exclude
    exclude: [
        '**/temp/*'
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
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox'],
      browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
