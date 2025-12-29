const validators = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Base Controller
 * Provides common functionality for all controllers
 * Contains shared validation and error handling logic
 */
class BaseController {
  /**
   * Validate ID parameter
   * @param {*} id - ID to validate
   * @param {string} entityName - Name of entity (e.g., 'user', 'post')
   * @throws {Error} If ID is invalid
   */
  validateId(id, entityName = 'entity') {
    if (!id || typeof id !== 'number') {
      throw new Error(`Invalid ${entityName} ID`);
    }
  }

  /**
   * Validate response status
   * @param {number} status - HTTP status code
   * @throws {Error} If status is not successful
   */
  validateStatus(status) {
    if (!validators.isSuccessStatus(status)) {
      throw new Error(`Unexpected status: ${status}`);
    }
  }

  /**
   * Validate required fields in data object
   * @param {object} data - Data object to validate
   * @param {string[]} requiredFields - Array of required field names
   * @throws {Error} If required fields are missing
   */
  validateRequiredFields(data, requiredFields) {
    const isValid = validators.hasRequiredFields(data, requiredFields);
    
    if (!isValid) {
      const missing = requiredFields.filter(field => !data.hasOwnProperty(field));
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  }

  /**
   * Validate response data is an array
   * @param {*} data - Data to validate
   * @param {string} entityName - Name of entity (e.g., 'users', 'posts')
   * @throws {Error} If data is not an array
   */
  validateArrayResponse(data, entityName = 'items') {
    if (!Array.isArray(data)) {
      throw new Error(`Expected array of ${entityName}`);
    }
  }

  /**
   * Validate response data has required fields
   * @param {object} data - Data object to validate
   * @param {string[]} requiredFields - Array of required field names
   * @throws {Error} If required fields are missing
   */
  validateResponseFields(data, requiredFields) {
    if (!validators.hasRequiredFields(data, requiredFields)) {
      throw new Error(`${data.constructor.name || 'Data'} missing required fields`);
    }
  }

  /**
   * Execute operation with error handling and logging
   * @param {Function} operation - Async function to execute
   * @param {string} operationName - Name of operation for logging
   * @returns {Promise<*>} Result of operation
   */
  async executeWithErrorHandling(operation, operationName) {
    try {
      return await operation();
    } catch (error) {
      // Extract safe error information to avoid circular reference issues
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error && error.stack ? error.stack : undefined;
      
      logger.error(`Error in ${operationName}: ${errorMessage}`, errorStack ? { stack: errorStack } : null);
      throw error;
    }
  }

  /**
   * Log successful operation
   * @param {string} message - Log message
   * @param {object} data - Additional data to log
   */
  logSuccess(message, data = null) {
    logger.info(message, data);
  }

  /**
   * Handle verify option for create operations
   * @param {Function} verifyFunction - Function to verify creation
   * @param {boolean} shouldVerify - Whether to verify
   * @returns {Promise<void>}
   */
  async handleVerify(verifyFunction, shouldVerify) {
    if (shouldVerify) {
      await verifyFunction();
      logger.info('Creation verified');
    }
  }

  /**
   * Handle verify option for update operations
   * @param {Function} verifyFunction - Function to verify update
   * @param {object} updateData - Data that was updated
   * @param {boolean} shouldVerify - Whether to verify
   * @returns {Promise<void>}
   */
  async handleUpdateVerify(verifyFunction, updateData, shouldVerify) {
    if (shouldVerify) {
      const verifyResponse = await verifyFunction();
      // Verify that data was updated
      Object.keys(updateData).forEach(key => {
        if (verifyResponse.data[key] !== updateData[key]) {
          logger.warn(`Field ${key} may not have been updated`);
        }
      });
    }
  }

  /**
   * Handle verify option for delete operations
   * @param {Function} verifyFunction - Function to verify deletion
   * @param {number} id - ID of deleted entity
   * @param {boolean} shouldVerify - Whether to verify
   * @returns {Promise<void>}
   */
  async handleDeleteVerify(verifyFunction, id, shouldVerify) {
    if (shouldVerify) {
      try {
        await verifyFunction();
        logger.warn(`Entity ${id} may still exist`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          logger.info(`Entity ${id} successfully deleted`);
        }
      }
    }
  }
}

module.exports = BaseController;
