import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#223528",
};

export const metadata: Metadata = {
  title: "Daleel | Secondary Project Incubator Platform",
  description: "Cross-disciplinary secondary learning operating system with gamified progression, Socratic mentorship, and authentic project-based learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9F8F5] text-[#18221B] antialiased selection:bg-emerald-100 selection:text-emerald-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
