const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../src'),
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: '../test/unit/coverage',
  collectCoverageFrom: ['api/**/*.js', '!**/node_modules/**'],
  testEnvironment: 'node',
};
