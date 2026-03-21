const { createEsmPreset } = require('jest-preset-angular/presets');
const preset = createEsmPreset();

module.exports = {
  ...preset,
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    '^@fancyapps/ui$': '<rootDir>/test/mocks/fancyapps-ui.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/out-tsc/'],
  transformIgnorePatterns: ['node_modules/(?!tslib|rxjs)'],
};
