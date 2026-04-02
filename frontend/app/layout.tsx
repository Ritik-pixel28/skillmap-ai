import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackButton from "@/components/BackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillMap AI | Map Your Tech Career with AI",
  description: "Get personalized, AI-generated learning roadmaps tailored to your goals. Master skills through project-based assignments and track progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white antialiased`}>
        <BackButton />
        {children}
      </body>
    </html>
  );
}
