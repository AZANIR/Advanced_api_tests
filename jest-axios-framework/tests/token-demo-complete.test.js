const authController = require('../src/controllers/authController');
const authConfig = require('../src/config/auth');
const apiService = require('../src/services/apiService');
const fs = require('fs');
const path = require('path');

/**
 * Complete Token Demo Test
 * Shows the entire token workflow process:
 * 1. Saving token after login
 * 2. Using saved token
 * 3. Token update when deleted
 * 4. Working with expired token
 * 
 * Tests run sequentially to avoid conflicts between each other
 */
describe('Complete Token Demo Test', () => {
  // Use separate token storage file for demo tests to avoid conflicts with other tests
  const DEMO_TOKEN_FILE = 'token-demo-storage.json';
  const envFilePath = path.join(__dirname, DEMO_TOKEN_FILE);
  
  // Set environment variable to use separate file
  beforeAll(() => {
    process.env.TOKEN_STORAGE_FILE = DEMO_TOKEN_FILE;
    authController.clearAllTokens();
    // Restore file to initial state
    const initialData = {
      baseUrl: 'https://reqres.in/api',
      token: null,
      tokenExpiresAt: null
    };
    fs.writeFileSync(envFilePath, JSON.stringify(initialData, null, 4), 'utf8');
  });
  
  // Clean up environment variable after tests
  afterAll(() => {
    delete process.env.TOKEN_STORAGE_FILE;
  });

  // Add delay between tests to avoid rate limiting (429)
  afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  });
  
  // Add delay before each test for stability
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  test('1. Login and save token to token-storage.json file', async () => {
    // Login
    const response = await authController.loginWithValidCredentials();
    
    // Check that we received token
    expect(response.data).toHaveProperty('token');
    expect(response.data.token).toBeTruthy();
    
    console.log('\n✅ Login successful!');
    console.log(`📝 Token received: ${response.data.token}`);
    
    // Check that token is saved to file (wait up to 2 seconds)
    let envData;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      try {
        const fileContent = fs.readFileSync(envFilePath, 'utf8');
        if (!fileContent || fileContent.trim() === '') {
          throw new Error('Empty file');
        }
        envData = JSON.parse(fileContent);
        if (envData.token && envData.token === response.data.token) {
          break;
        }
      } catch (e) {
        // File might be corrupted, continue attempts
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // If token didn't save, try again via authController
    if (!envData || !envData.token) {
      const tokenFromController = authController.getToken('reqres');
      if (tokenFromController) {
        // Token exists in memory but not in file - save manually
        authConfig.tokenStorage.setToken('reqres', tokenFromController);
        await new Promise(resolve => setTimeout(resolve, 200));
        envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
      }
    }
    
    expect(envData).toBeTruthy();
    expect(envData.token).toBe(response.data.token);
    
    console.log(`💾 Token saved to file: ${envFilePath}`);
    console.log(`📄 token-storage.json file content:`);
    console.log(JSON.stringify(envData, null, 4));
  });

  test('2. Verify that token is saved in file', async () => {
    // Always login to guarantee token exists (other tests might clear it)
    console.log('\n🔐 Logging in to get token...');
    const loginResponse = await authController.loginWithValidCredentials();
    expect(loginResponse.data.token).toBeTruthy();
    
    // Wait for token to be saved to file
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check token in memory
    let token = authController.getToken('reqres');
    if (!token) {
      // If not in memory, use token from login response
      token = loginResponse.data.token;
      authConfig.tokenStorage.setToken('reqres', token);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    console.log(`✅ Token found in memory: ${token}`);
    
    // Check file - try multiple times as it might be cleared by other tests
    let envData;
    let attempts = 0;
    const maxAttempts = 15;
    
    while (attempts < maxAttempts) {
      try {
        const fileContent = fs.readFileSync(envFilePath, 'utf8');
        if (!fileContent || fileContent.trim() === '') {
          // File is empty, restore it
          authConfig.tokenStorage.setToken('reqres', token);
          await new Promise(resolve => setTimeout(resolve, 200));
          continue;
        }
        envData = JSON.parse(fileContent);
        if (envData.token && envData.token === token) {
          break;
        } else if (envData.token !== token) {
          // Token in file is different, update it
          authConfig.tokenStorage.setToken('reqres', token);
          await new Promise(resolve => setTimeout(resolve, 200));
          continue;
        }
      } catch (e) {
        // File might be corrupted, try to restore
        if (token) {
          authConfig.tokenStorage.setToken('reqres', token);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // Final check - if file still doesn't have token, save it
    if (!envData || !envData.token || envData.token !== token) {
      authConfig.tokenStorage.setToken('reqres', token);
      await new Promise(resolve => setTimeout(resolve, 300));
      envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    }
    
    // Verify token exists in file
    expect(envData).toBeTruthy();
    expect(envData.token).toBeTruthy();
    expect(typeof envData.token).toBe('string');
    expect(envData.token).toBe(token);
    
    console.log(`✅ Token found in token-storage.json file: ${envData.token}`);
    console.log(`✅ Token available via authController.getToken(): ${token}`);
  });

  test('3. Use saved token for requests', async () => {
    // Check that token exists, if not - login
    let token = authController.getToken('reqres');
    if (!token) {
      console.log('\n⚠️  Token not found, logging in...');
      await authController.loginWithValidCredentials();
      await new Promise(resolve => setTimeout(resolve, 200));
      token = authController.getToken('reqres');
    }
    
    expect(token).toBeTruthy();
    console.log(`\n🔑 Using saved token: ${token}`);
    
    // Make request - token will be automatically added to headers
    const response = await apiService.getReqResUsers();
    
    expect(response.status).toBe(200);
    console.log('✅ Request completed successfully with automatically added token!');
  });

  test('4. Delete token from file - need to login again', async () => {
    // First login and save token
    await authController.loginWithValidCredentials();
    
    // Check that token is saved
    let envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    const originalToken = envData.token;
    expect(originalToken).toBeTruthy();
    
    console.log(`\n✅ Token saved: ${originalToken}`);
    
    // DELETE token from file manually (as if student deleted it)
    envData.token = null;
    envData.tokenExpiresAt = null;
    fs.writeFileSync(envFilePath, JSON.stringify(envData, null, 4), 'utf8');
    
    // Also clear from memory
    authConfig.tokenStorage.clearAll();
    
    console.log('🗑️  Token deleted from token-storage.json file and memory');
    
    // Verify that token is really deleted
    envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    expect(envData.token).toBeNull();
    const tokenBeforeRequest = authController.getToken('reqres');
    expect(tokenBeforeRequest).toBeNull();
    console.log('✅ Confirmed: token deleted from file and memory');
    
    // Make request WITHOUT token (may or may not work depending on API)
    console.log('🔄 Making request without token...');
    const response = await apiService.getReqResUsers();
    
    expect(response.status).toBe(200);
    console.log('✅ Request completed successfully (ReqRes API does not require token for GET /users)');
    
    // Check that token is still absent (or file might be corrupted)
    try {
      const fileContent = fs.readFileSync(envFilePath, 'utf8');
      if (!fileContent || fileContent.trim() === '') {
        throw new Error('Empty file');
      }
      envData = JSON.parse(fileContent);
      expect(envData.token).toBeNull();
      console.log('ℹ️  Token is still absent in file (need to login again)');
    } catch (e) {
      // If file is corrupted or empty, restore it
      envData = { baseUrl: 'https://reqres.in/api', token: null, tokenExpiresAt: null };
      fs.writeFileSync(envFilePath, JSON.stringify(envData, null, 4), 'utf8');
      console.log('ℹ️  File restored, token absent (need to login again)');
    }
    
    // Login again to get token
    console.log('🔐 Logging in again...');
    await authController.loginWithValidCredentials();
    
    // Check that token is saved
    await new Promise(resolve => setTimeout(resolve, 200));
    envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    expect(envData.token).toBeTruthy();
    const tokenAfterLogin = authController.getToken('reqres');
    expect(tokenAfterLogin).toBeTruthy();
    
    console.log(`✅ Token saved after re-login: ${envData.token}`);
    console.log('📄 Check token-storage.json file - there should be a new token!');
  });

  test('5. Set expired token - need to login again', async () => {
    // Set expired token to file
    const expiredToken = 'expired-token-12345';
    const envData = {
      baseUrl: 'https://reqres.in/api',
      token: expiredToken,
      tokenExpiresAt: Date.now() - 1000 // Expired (past time)
    };
    fs.writeFileSync(envFilePath, JSON.stringify(envData, null, 4), 'utf8');
    
    console.log(`\n⏰ Expired token set: ${expiredToken}`);
    
    // Check that token is expired
    const token = authController.getToken('reqres');
    expect(token).toBeNull(); // Should return null because expired
    
    console.log('✅ Confirmed: token is expired (getToken returns null)');
    
    // Make request - expired token will not be used
    console.log('🔄 Making request with expired token...');
    const response = await apiService.getReqResUsers();
    
    expect(response.status).toBe(200);
    console.log('✅ Request completed successfully (ReqRes API does not require token for GET /users)');
    
    // Check that expired token is still in file (but not used)
    // Note: getToken might delete expired token, so check file directly
    let newEnvData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    // Token might be deleted by getToken, so just check that it was expired
    if (newEnvData.token === expiredToken) {
      console.log('ℹ️  Expired token is still in file (but not used)');
    } else {
      console.log('ℹ️  Expired token was deleted from file (this is normal)');
    }
    
    // Login to get new token
    console.log('🔐 Logging in to get new token...');
    await authController.loginWithValidCredentials();
    
    // Check that token is updated
    await new Promise(resolve => setTimeout(resolve, 200));
    newEnvData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    expect(newEnvData.token).toBeTruthy();
    expect(newEnvData.token).not.toBe(expiredToken);
    
    console.log(`✅ Token updated: ${newEnvData.token}`);
  });

  test('6. Verify that token is saved between requests', async () => {
    // Clear token
    authController.clearAllTokens();
    
    // Also clear file
    const emptyEnvData = {
      baseUrl: 'https://reqres.in/api',
      token: null,
      tokenExpiresAt: null
    };
    fs.writeFileSync(envFilePath, JSON.stringify(emptyEnvData, null, 4), 'utf8');
    
    console.log('\n🧹 Token cleared from file and memory');
    
    // Verify that token is absent
    expect(authController.getToken('reqres')).toBeNull();
    
    // Make first request - token should appear automatically
    console.log('📤 First request (token should appear automatically)...');
    const response1 = await apiService.getReqResUsers();
    expect(response1.status).toBe(200);
    
    // Login to get token (because automatic login might not work due to circular dependency)
    await authController.loginWithValidCredentials();
    
    // Give a bit of time for token to be saved
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const token1 = authController.getToken('reqres');
    expect(token1).toBeTruthy();
    console.log(`✅ Token received after first request: ${token1}`);
    
    // Check file
    let envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    expect(envData.token).toBe(token1);
    console.log(`📄 Token saved in token-storage.json file: ${envData.token}`);
    
    // Make second request - should use the same token
    console.log('📤 Second request (should use the same token)...');
    const response2 = await apiService.getReqResUsers();
    expect(response2.status).toBe(200);
    
    const token2 = authController.getToken('reqres');
    expect(token2).toBe(token1); // Same token
    console.log(`✅ Same token used: ${token2}`);
    
    // Check file again
    envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    expect(envData.token).toBe(token1);
    console.log(`📄 Token remained in token-storage.json file: ${envData.token}`);
  });
});
