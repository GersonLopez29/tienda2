import { config } from "dotenv";
config({ path: ".env.local" });

// One-off migration helper: creates a User row for the site owner from the
// legacy ADMIN_EMAIL/ADMIN_PASSWORD_HASH_B64 env vars, then backfills
// sellerId on every Product that doesn't have one yet. Idempotent — safe
// to re-run (upserts the admin by email, only updates NULL sellerId rows).
//
// Must run against a schema where Product.sellerId is still nullable (the
// "add_user_and_seller" migration, before "require_seller_id" is applied) —
// that's why the where-clauses below cast past the generated types, which
// reflect whatever schema.prisma currently says sellerId's nullability is.
//
// Usage:
//   npx tsx prisma/scripts/backfill-admin-seller.ts --dry-run
//   npx tsx prisma/scripts/backfill-admin-seller.ts

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const { prisma } = await import("../../src/lib/db");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  const adminWhatsapp = process.env.ADMIN_WHATSAPP;
  if (!adminEmail || !adminHashB64 || !adminWhatsapp) {
    throw new Error("ADMIN_EMAIL, ADMIN_PASSWORD_HASH_B64 y ADMIN_WHATSAPP deben estar en .env.local");
  }
  const passwordHash = Buffer.from(adminHashB64, "base64").toString("utf8");

  const orphanWhere = { sellerId: null } as unknown as { sellerId: string };
  const orphanCount = await prisma.product.count({ where: orphanWhere });
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail.toLowerCase() } });

  console.log(
    DRY_RUN
      ? `[dry-run] Crearía/actualizaría el usuario admin (${adminEmail}) y asignaría sellerId a ${orphanCount} producto(s) huérfano(s).`
      : `Backfill: usuario admin (${adminEmail}), ${orphanCount} producto(s) a actualizar.`
  );
  console.log(`Admin existente: ${existingAdmin ? "sí" : "no"}`);

  if (DRY_RUN) {
    await prisma.$disconnect();
    return;
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      name: "K&N'Store",
      email: adminEmail.toLowerCase(),
      passwordHash,
      whatsapp: adminWhatsapp,
      role: "admin",
      emailVerified: true,
    },
  });

  const result = await prisma.product.updateMany({
    where: orphanWhere,
    data: { sellerId: admin.id },
  });

  console.log(`Listo. Admin id=${admin.id}. Productos actualizados: ${result.count}.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
