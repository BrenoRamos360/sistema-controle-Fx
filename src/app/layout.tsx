import type { Metadata } from "next";
import "@fontsource/geist-sans";
import "@fontsource/geist-mono";
import "@fontsource/inter";
import "@fontsource/roboto";
import "@fontsource/fira-code";
import "@fontsource/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Control Financiero",
  description: "Gestiona tus finanzas de forma inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
