// === REGISTER ===
/**
 * Register body schema
 * @typedef {object} Register
 * @property {string} email.required
 * @property {string} fullname.required
 * @property {string} password.required
 */

/**
 * Register response
 * @typedef {object} RegisterResponse
 * @property {boolean} success
 * @property {string} message
 * @property {object} results
 * @property {UserResponse} results.user
 * @property {AccountResponse} results.account
 */

/**
 * @typedef {object} UserResponse
 * @property {integer} id
 * @property {string} email
 */

/**
 * @typedef {object} AccountResponse
 * @property {string} fullname
 */


// === LOGIN ===
/**
 * @typedef  {object} Login
 * @property {string} email.required - Email
 * @property {string} password.required - Password
 */

/**
 * @typedef  {object} LoginResponse
 * @property {boolean} success
 * @property {string} message
 * @property {object} results
 * @property {string} results.token
 */