/**
 * @typedef {object} CreateCart
 * @property {number} product_id.required - Product id
 * @property {number} quantity.required - quantity product
 * @property {number} size - size product
 * @property {number} variant - variant product
 */

/**
 * @typedef {object} Orders
 * @property {string} fullname - fullname
 * @property {string} address - address
 * @property {string} phone - phone
 * @property {string} email - email
 * @property {number} id_paymentMethod.required - id_payment
 * @property {number} id_delivery.required -  id_delivery
 */