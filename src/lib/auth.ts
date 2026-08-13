import "server-only";
import bcrypt from "bcryptjs";

// Constant-time-ish comparison against a bcrypt hash even when the email
// doesn't match, so a failed login doesn't reveal whether the email exists.
const FALLBACK_HASH = "$2b$12$K8Z3Q5f9y1v9nJ5X5wq5xeYFhF5w9c1cE1a1S1e1e1e1e1e1e1e1u";

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!adminEmail || !adminHashB64) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH_B64 is not set");
  }
  // Stored base64-encoded: the bcrypt hash is full of `$`, which Next's env
  // loader (dotenv-expand) treats as variable interpolation and corrupts.
  const adminHash = Buffer.from(adminHashB64, "base64").toString("utf8");

  const emailMatches = email.trim().toLowerCase() === adminEmail.toLowerCase();
  const hashToCheck = emailMatches ? adminHash : FALLBACK_HASH;
  const passwordMatches = await bcrypt.compare(password, hashToCheck);

  return emailMatches && passwordMatches;
}
