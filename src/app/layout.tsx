import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daleel | Secondary Project Incubator Platform",
  description: "Cross-disciplinary secondary learning operating system with gamified progression, Socratic mentorship, and strict relational learning analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9F8F5] text-[#18221B] antialiased selection:bg-emerald-100 selection:text-emerald-950">
        {children}
      </body>
    </html>
  );
}
