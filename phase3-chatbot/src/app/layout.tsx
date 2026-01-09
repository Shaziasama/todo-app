import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phase 3 Chatbot - AI Todo Assistant",
  description: "Manage your todos through natural language chat with LocalAI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-navy text-sky-blue`}
      >
        <SessionProvider session={session}>
          {isAuthenticated ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 flex flex-col">
                <Navbar session={session} />
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
                <Footer />
              </main>
            </div>
          ) : (
            <div>{children}</div>
          )}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
