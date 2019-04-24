// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov'],
  testEnvironment: 'jest-environment-jsdom',
  testRegex: ['(/test/.*\\.spec\\.js)$'],
};
