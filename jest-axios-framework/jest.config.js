const reportConfig = require('./src/utils/reportConfig');

module.exports = {
  // Середовище для Node.js
  testEnvironment: 'node',
  
  // Патерн для пошуку тестових файлів
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  
  // Timeout для тестів (10 секунд)
  testTimeout: 10000,
  
  // Детальний вивід
  verbose: true,
  
  // Coverage налаштування
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/index.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Репортери
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'junit.xml',
        suiteName: 'jest tests',
        // Використовує назву describe блоку як classname
        classNameTemplate: '{classname}',
        // Використовує назву тесту (it/test) як name
        titleTemplate: '{title}',
        // Роздільник між вкладеними describe блоками
        ancestorSeparator: ' › ',
        // Використовує шлях до файлу для suite name
        usePathForSuiteName: 'true',
      },
    ],
    [
      'jest-html-reporters',
      reportConfig.getReporterConfig(),
    ],
  ],
  
  // Налаштування для модулів
  moduleFileExtensions: ['js', 'json'],
  
  // Налаштування для трансформації
  transform: {},
  
  // Налаштування для середовища
  setupFilesAfterEnv: []
};

