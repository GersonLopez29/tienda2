import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const staticRoutes: MetadataRoute.Sitemap = ["/", "/vender", "/registro", "/login", "/guia-tallas"].map((path) => ({
    url: `${APP_URL}${path}`,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${APP_URL}/producto/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
