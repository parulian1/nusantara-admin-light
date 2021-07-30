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
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/nusantara-admin'),
      reports: ['cobertura', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    // optionally, configure the reporter
    coverageReporter: {
      type : 'cobertura',
      dir : require('path').join(__dirname, './coverage/nusantara-admin'),
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'cobertura', subdir: '.', file: 'TEST-nusantara-admin.xml' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
      ]
    },
    reporters: ['progress', 'spec', 'kjhtml' , 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};
