import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K&N'Store",
  description: "Ropa de segunda mano seleccionada — vintage, streetwear y casual.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
