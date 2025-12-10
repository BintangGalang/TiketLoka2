import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // <--- Import ini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TiketLoka",
  description: "Booking Wisata Mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Bungkus Children dengan AuthProvider */}
        <AuthProvider>
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}