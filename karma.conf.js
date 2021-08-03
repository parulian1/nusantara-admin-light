// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-spec-reporter'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './reports/coverage/nusantara-admin'),
      reports: ['cobertura', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    // optionally, configure the reporter
    coverageReporter: {
      type : 'cobertura',
      dir : require('path').join(__dirname, './reports/coverage/nusantara-admin'),
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'cobertura', subdir: '.', file: 'cobertura-coverage.xml' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
      ]
    },
    // the default configuration
    junitReporter: {
      outputDir:  require('path').join(__dirname, './reports/coverage/nusantara-admin'), // results will be saved as $outputDir/$browserName.xml
      outputFile: 'TEST-nusantara-admin.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
    //   suite: '', // suite will become the package name attribute in xml testsuite element
    //   useBrowserName: true, // add browser name to report and classes names
    //   nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
    //   classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
    //   properties: {}, // key value pair of properties to add to the <properties> section of the report
    //   xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    },
    reporters: ['progress', 'spec', 'junit' , 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};
