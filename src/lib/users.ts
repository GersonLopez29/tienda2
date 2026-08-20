import "server-only";
import { prisma } from "@/lib/db";

export type UserInput = {
  name: string;
  email: string;
  passwordHash: string;
  whatsapp: string;
};

export function createUser(data: UserInput) {
  return prisma.user.create({ data });
}

export function setVerificationToken(id: string, token: string, expiresAt: Date) {
  return prisma.user.update({
    where: { id },
    data: { verificationToken: token, verificationTokenExpiresAt: expiresAt },
  });
}

export function verifyUserEmail(id: string) {
  return prisma.user.update({
    where: { id },
    data: { emailVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
  });
}

export function setResetToken(id: string, token: string, expiresAt: Date) {
  return prisma.user.update({
    where: { id },
    data: { resetToken: token, resetTokenExpiresAt: expiresAt },
  });
}

export function resetUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function getUserByVerificationToken(token: string) {
  return prisma.user.findUnique({ where: { verificationToken: token } });
}

export function getUserByResetToken(token: string) {
  return prisma.user.findUnique({ where: { resetToken: token } });
}

export function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export function setUserBlocked(id: string, isBlocked: boolean) {
  return prisma.user.update({ where: { id }, data: { isBlocked } });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
