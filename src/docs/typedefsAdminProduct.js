// --- LIST PRODUCT ---

/**
 * @typedef  {object} ProductResponse
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} stock
 * @property {number} rating
 * @property {object} images
 * @property {string} images.image_one
 * @property {string} images.image_two
 * @property {string} images.image_three
 * @property {string} images.image_four
 * @property {Array.<string>} size
 * @property {Array.<string>} variant
 */


// --- CREATE PRODUCT ---

/**
 * @typedef {object} ProductInput
 * @property {string} name.required - Product name
 * @property {string} description.required - Product description
 * @property {number} price.required - Product original price
 * @property {number} rating.required- Product rating
 * @property {number} stock.required - Product stock
 * @property {number[]} size.required - Product size ID
 * @property {number[]} variant.required - Product variant ID
 * @property {number[]} category.required - Product category ID
 * @property {string} image_one - Product image one - binary
 * @property {string} image_two - Product image two - binary
 * @property {string} image_three - Product image three - binary
 * @property {string} image_four - Product image four - binary
 */

// --- UPDATE PRODUCT ---

/**
 * @typedef {object} ProductUpdateInput
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product original price
 * @property {number} rating - Product rating
 * @property {number} stock - Product stock
 * @property {number[]} size - Product size ID
 * @property {number[]} variant - Product variant ID
 * @property {number[]} category - Product category ID
 * @property {string} image_one - Product image one - binary
 * @property {string} image_two - Product image two - binary
 * @property {string} image_three - Product image three - binary
 * @property {string} image_four - Product image four - binary
 */