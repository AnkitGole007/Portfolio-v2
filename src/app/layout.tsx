import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ankit Gole | AI Engineer & Researcher",
  description: "AI Engineer specializing in LLMs, RAG systems, and Generative AI. Masters in Artificial Intelligence at WPI.",
  keywords: ["AI Engineer", "Machine Learning", "LLMs", "RAG", "Deep Learning", "Ankit Gole", "WPI"],
  authors: [{ name: "Ankit Gole" }],
  openGraph: {
    title: "Ankit Gole | AI Engineer & Researcher",
    description: "AI Engineer specializing in LLMs, RAG systems, and Generative AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
