import { redirect } from "next/navigation";

export default async function ChatPage() {
  // Redirect to dashboard since chat is now displayed there
  redirect("/");
}
