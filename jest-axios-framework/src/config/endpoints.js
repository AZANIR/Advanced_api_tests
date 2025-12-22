const config = require('./config');

/**
 * Конфігурація endpoints
 * Централізоване зберігання всіх endpoints для легкого управління
 */
const endpoints = {
  // JSONPlaceholder API endpoints
  jsonplaceholder: {
    users: `${config.baseURL}/users`,
    userById: (id) => `${config.baseURL}/users/${id}`,
    posts: `${config.baseURL}/posts`,
    postById: (id) => `${config.baseURL}/posts/${id}`,
    comments: `${config.baseURL}/comments`,
    albums: `${config.baseURL}/albums`,
    photos: `${config.baseURL}/photos`,
    todos: `${config.baseURL}/todos`
  },
  
  // ReqRes API endpoints
  reqres: {
    users: `${config.reqresBaseURL}/users`,
    userById: (id) => `${config.reqresBaseURL}/users/${id}`,
    login: `${config.reqresBaseURL}/login`,
    register: `${config.reqresBaseURL}/register`,
    resources: `${config.reqresBaseURL}/unknown`
  },
  
  // Petstore Swagger API endpoints
  petstore: {
    pets: `${config.petstoreBaseURL}/pet`,
    petById: (id) => `${config.petstoreBaseURL}/pet/${id}`,
    petsByStatus: (status) => `${config.petstoreBaseURL}/pet/findByStatus?status=${status}`,
    users: `${config.petstoreBaseURL}/user`,
    userByUsername: (username) => `${config.petstoreBaseURL}/user/${username}`,
    login: `${config.petstoreBaseURL}/user/login`,
    logout: `${config.petstoreBaseURL}/user/logout`,
    orders: `${config.petstoreBaseURL}/store/order`,
    orderById: (id) => `${config.petstoreBaseURL}/store/order/${id}`,
    inventory: `${config.petstoreBaseURL}/store/inventory`
  }
};

module.exports = endpoints;

