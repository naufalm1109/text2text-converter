import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { GeistSans } from "geist/font";

export const metadata: Metadata = {
  title: "Text-to-Text Converter",
  description: "Convert between text-based formats (MVP).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`
          ${GeistSans.className} min-h-screen bg-[radial-gradient(1200px_circle_at_30%_20%,#ffe4e6_0%,transparent_55%),linear-gradient(to_bottom_right,var(--bg),var(--bg2))]text-[color:var(--text)]
        `}
      >
        {children}

        {/* Semua provider client-side ditempatkan di sini */}
        <ClientProviders />
      </body>
    </html>
  );
}