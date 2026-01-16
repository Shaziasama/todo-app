import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ReactNode } from "react";
import { Todo } from "@prisma/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phase 3 Chatbot - AI Todo Assistant",
  description: "Manage your todos through natural language chat with AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  // Fetch todos for authenticated users to pass to sidebar
  let todos: Todo[] = [];
  let userId: string | null = null;
  if (isAuthenticated && session?.user?.id) {
    userId = session.user.id;
    todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] text-sky-blue`}
      >
        <SessionProvider session={session}>
          <div className="flex flex-col min-h-screen">
            <Navbar session={session} />
            <div className="flex flex-1">
              {isAuthenticated ? (
                <AuthenticatedLayout todos={todos} userId={userId!}>
                  {children}
                </AuthenticatedLayout>
              ) : (
                <main className="flex-1">{children}</main>
              )}
            </div>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
