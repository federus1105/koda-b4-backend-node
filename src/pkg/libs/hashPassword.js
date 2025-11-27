import argon2 from "argon2";

/**
 * Hash a plain text password
 * @param {string} password - Plain password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  return await argon2.hash(password, { type: argon2.argon2id });
}

/**
 * Verify a plain password against a hashed password
 * @param {string} hashedPassword - Hashed password from database
 * @param {string} plainPassword - Password to verify
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(hashedPassword, plainPassword) {
  return await argon2.verify(hashedPassword, plainPassword);
}
