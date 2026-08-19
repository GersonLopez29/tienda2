import { config } from "dotenv";
config({ path: ".env.local" });

// Prendas de ejemplo para que el catálogo no empiece vacío.
// Edítalas o bórralas desde el panel admin (/admin) y sube fotos reales.
const SAMPLE_PRODUCTS = [
  {
    title: "Casaca Denim 90s",
    brand: "Levi's",
    category: "HOMBRE" as const,
    size: "M",
    condition: "VINTAGE" as const,
    price: 129,
    originalPrice: 159,
    material: "100% algodón denim rígido",
    story:
      "Pieza original de los 90 con desgaste natural en los bolsillos — parte de su carácter, no un defecto.",
    pairing: "Combínala con un polo blanco básico y jean recto para un look sin esfuerzo.",
    measurements: { Largo: 68, Pecho: 58, Manga: 62 },
    images: [] as string[],
  },
  {
    title: "Vestido Slip Satinado",
    brand: "Y2K Label",
    category: "MUJER" as const,
    size: "S",
    condition: "COMO_NUEVA" as const,
    price: 79,
    originalPrice: null,
    material: "Satén de poliéster con caída fluida",
    story: "Comprado y usado una sola vez para un evento — impecable.",
    pairing: "Con una campera de cuero encima y botas, pasa de día a noche fácil.",
    measurements: { Largo: 94, Cintura: 66, Busto: 80 },
    images: [] as string[],
  },
  {
    title: "Hoodie Reverse Weave",
    brand: "Champion",
    category: "UNISEX" as const,
    size: "L",
    condition: "POCO_USO" as const,
    price: 89,
    originalPrice: null,
    material: "Algodón grueso reverse weave",
    story: "Usado un par de veces, sin bolitas ni manchas. Interior todavía afelpado.",
    pairing: "Ideal con cargo pants y zapatillas retro para un fit casual streetwear.",
    measurements: { Largo: 70, Pecho: 62, Manga: 60 },
    images: [] as string[],
  },
];

async function main() {
  // Dynamic import: db.ts reads process.env.DATABASE_URL at module load
  // time, and static `import` statements are hoisted above the config()
  // call at the top of this file.
  const { prisma } = await import("../src/lib/db");

  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Ya hay ${existing} prendas en la base — no se agregan ejemplos.`);
    return prisma;
  }

  const seller = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!seller) {
    console.log("No hay un usuario admin todavía — corré prisma/scripts/backfill-admin-seller.ts primero.");
    return prisma;
  }

  await prisma.product.createMany({
    data: SAMPLE_PRODUCTS.map((p) => ({ ...p, sellerId: seller.id })),
  });
  console.log(`Sembradas ${SAMPLE_PRODUCTS.length} prendas de ejemplo.`);
  return prisma;
}

main()
  .then((prisma) => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
