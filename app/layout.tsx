import type { Metadata } from "next";
import "./globals.css";
import coreStyles from "./globals.css?raw";
import "./tile-typography.css";
import CommandCenter from './command-center';
import {requireChatGPTUser} from './chatgpt-auth';
export const dynamic='force-dynamic';

export const metadata: Metadata = {
  title: "Tyler's Brief",
  description: "A private, evidence-centered intelligence workspace.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireChatGPTUser('/');
  return (
    <html lang="en">
      <head><style id="dashboard-core-styles" dangerouslySetInnerHTML={{__html:coreStyles.replace(/@import\s+url\([^;]+;/g,'')}}/></head>
      <body className="antialiased"><CommandCenter/>{children}</body>
    </html>
  );
}
