/**
 * @typedef {object} CreateUserInput
 * @property {string} email.required - User email
 * @property {string} password.required - User password
 * @property {string} role.required - User role (admin/user)
 * @property {string} fullname.required - Full name
 * @property {string} phone.required - Phone number
 * @property {string} address.required - Address
 * @property {string} photos.required - Photos - binary
 */

/**
 * @typedef {object} UpdateUserInput
 * @property {string} email - User email
 * @property {string} role - User role (admin/user)
 * @property {string} fullname - Full name
 * @property {string} phone - Phone number
 * @property {string} address - Address
 * @property {string} photos - Photos - binary
 */
