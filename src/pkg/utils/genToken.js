import crypto from "crypto";

export async function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}
