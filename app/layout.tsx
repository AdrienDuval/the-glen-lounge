import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={site.lang}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
