import type { Metadata } from "next";
import "./globals.css";
import CommandCenter from './command-center';
import {requireChatGPTUser} from './chatgpt-auth';
export const dynamic='force-dynamic';

export const metadata: Metadata = {
  title: "Tyler's View",
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
      <body className="antialiased"><CommandCenter/>{children}</body>
    </html>
  );
}
