module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js', '<rootDir>/test/**/*.spec.js'],
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
};

