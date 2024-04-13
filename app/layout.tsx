import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Header } from "@/components/header";
import { APP_DESCRIPTION, APP_NAME } from "@/data/constants";
import { Toaster } from "@/components/ui/toaster"

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={font.className}>
          <div className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-sm dark:shadow-gray-800 px-10">
            <Header />
          </div>
          <main className="">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
