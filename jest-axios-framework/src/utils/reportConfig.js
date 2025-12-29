const path = require('path');
const fs = require('fs');

// Отримання package.json
function getPackageJson() {
  try {
    const packagePath = path.join(__dirname, '../../package.json');
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch (error) {
    return { name: 'API Test Framework', version: '1.0.0' };
  }
}

const packageJson = getPackageJson();

/**
 * Report Configuration
 * Розширена конфігурація для jest-html-reporters
 */

/**
 * Отримання метаданих для звіту
 * @returns {object} Метадані про середовище та версію
 */
function getReportMetadata() {
  return {
    projectName: packageJson.name || 'API Test Framework',
    version: packageJson.version || '1.0.0',
    environment: process.env.ENVIRONMENT || 'development',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    gitCommit: process.env.GITHUB_SHA || 'local',
    gitBranch: process.env.GITHUB_REF_NAME || 'local'
  };
}

/**
 * Базова конфігурація jest-html-reporters
 * @param {object} options - Додаткові опції
 * @returns {object} Конфігурація репортера
 */
function getHtmlReporterConfig(options = {}) {
  const defaultConfig = {
    publicPath: 'reports/html',
    filename: 'report.html',
    expand: true,
    pageTitle: `${getReportMetadata().projectName} - Test Report`,
    hideIcon: false,
    pageSize: 'A4',
    openReport: false,
    includeFailureMsg: true,
    includeSuiteFailure: true,
    includeConsoleLog: false,
    logoImgPath: undefined,
    testCommand: 'npm test',
    // Додаткові опції
    enableMergeData: true,
    dataDirPath: path.join(__dirname, '../../reports/html/data'),
    inlineSource: false,
    // Метадані
    metadata: getReportMetadata()
  };

  return { ...defaultConfig, ...options };
}

/**
 * Конфігурація для CI/CD середовища
 * @returns {object} Конфігурація для CI
 */
function getCiReporterConfig() {
  return getHtmlReporterConfig({
    publicPath: 'reports/html',
    filename: `index.html`,
    openReport: false,
    includeConsoleLog: true,
    metadata: {
      ...getReportMetadata(),
      ci: true,
      buildNumber: process.env.GITHUB_RUN_NUMBER || 'N/A',
      workflow: process.env.GITHUB_WORKFLOW || 'N/A'
    }
  });
}

/**
 * Конфігурація для локального середовища
 * @returns {object} Конфігурація для локальної розробки
 */
function getLocalReporterConfig() {
  return getHtmlReporterConfig({
    openReport: true, // Автоматично відкривати звіт
    includeConsoleLog: false,
    metadata: {
      ...getReportMetadata(),
      ci: false
    }
  });
}

/**
 * Отримання конфігурації в залежності від середовища
 * @returns {object} Конфігурація репортера
 */
function getReporterConfig() {
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  
  if (isCI) {
    return getCiReporterConfig();
  }
  
  return getLocalReporterConfig();
}

module.exports = {
  getHtmlReporterConfig,
  getCiReporterConfig,
  getLocalReporterConfig,
  getReporterConfig,
  getReportMetadata
};

