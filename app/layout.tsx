import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Velclaw Deploy Console", description: "Deployment control plane for Velclaw" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
