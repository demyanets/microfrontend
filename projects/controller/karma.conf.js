// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/controller'),
      reporters: [
        { type: 'html', subdir: 'html-report' },
        { type: 'json-summary', subdir: 'json-report' }
      ],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
      browsers: ['Chrome', 'ChromeHeadless'],
      singleRun: false,
      restartOnFileChange: true,
      customLaunchers: {
          ChromeHeadlessCustom: {
              base: 'ChromeHeadless',
              flags: ['--no-sandbox', '--disable-gpu']
          },
          Chrome_with_debugging: {
            base: 'Chrome',
            flags: ['--remote-debugging-port=9222'],
            debug: true
          }
      }
  });
};
