import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
const TITLE = "K&N'Store — Ropa de segunda mano vintage y streetwear en Perú";
const DESCRIPTION =
  "Ropa de segunda mano seleccionada a mano — vintage, streetwear y casual en buen estado. Envíos a todo el Perú.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: APP_URL,
    siteName: "K&N'Store",
    locale: "es_PE",
    type: "website",
    images: ["/kynstore-logo.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/kynstore-logo.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
