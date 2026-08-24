import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const appUrl = process.env.APP_URL ?? "http://localhost:3000";

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(`RESEND_API_KEY no está configurado — no se envió "${subject}" a ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error(`Falló el envío de "${subject}" a ${to}:`, err);
  }
}

export function sendVerificationEmail(to: string, name: string, token: string) {
  const url = `${appUrl}/verificar-email?token=${token}`;
  return send(
    to,
    "Verifica tu correo — K&N'Store",
    `<p>Hola ${name},</p><p>Confirma tu correo para activar tu cuenta:</p><p><a href="${url}">${url}</a></p><p>Este enlace vence en 24 horas.</p>`
  );
}

export function sendPasswordResetEmail(to: string, name: string, token: string) {
  const url = `${appUrl}/restablecer-password?token=${token}`;
  return send(
    to,
    "Restablece tu contraseña — K&N'Store",
    `<p>Hola ${name},</p><p>Restablece tu contraseña acá:</p><p><a href="${url}">${url}</a></p><p>Este enlace vence en 1 hora. Si no lo pediste, ignora este correo.</p>`
  );
}

export function sendNewStockAlertEmail(to: string, name: string, productTitle: string, productId: string) {
  const url = `${appUrl}/producto/${productId}`;
  return send(
    to,
    `Nueva prenda en tu categoría — ${productTitle}`,
    `<p>Hola ${name},</p><p>Acaba de publicarse una prenda nueva en una categoría que sigues:</p><p><strong>${productTitle}</strong></p><p><a href="${url}">${url}</a></p>`
  );
}

export function sendDuplicateRegistrationNotice(to: string, name: string) {
  return send(
    to,
    "Intento de registro con tu correo — K&N'Store",
    `<p>Hola ${name},</p><p>Alguien intentó crear una cuenta nueva con tu correo en K&N'Store. Si fuiste tú, inicia sesión normalmente o restablece tu contraseña. Si no fuiste tú, puedes ignorar este mensaje.</p>`
  );
}
