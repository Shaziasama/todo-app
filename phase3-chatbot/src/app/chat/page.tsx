import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChatShell } from "@/components/chat/ChatShell";
import { getMessages } from "@/lib/messages";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const messages = await getMessages(session.user.id, 100);

  return (
    <div className="h-screen w-full">
      <ChatShell
        userId={session.user.id}
        userEmail={session.user.email}
        initialMessages={messages}
      />
    </div>
  );
}
