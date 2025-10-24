import { useState } from "react";
import { useClientAuth } from "@/hooks/use-client-auth";
import { ChatList } from "@/components/chat-list";
import { ChatThread } from "@/components/chat-thread";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import type { ChatThread as ChatThreadType, Builder, Client, Order } from "@shared/schema";

interface ChatThreadWithDetails extends ChatThreadType {
  builder?: Builder;
  client?: Client;
  order?: Order | null;
}

export default function MessagesPage() {
  const { client } = useClientAuth();
  const [selectedThread, setSelectedThread] = useState<ChatThreadWithDetails | null>(null);

  if (!client) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
        <p className="text-muted-foreground">
          You need to connect your wallet to access messages
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" data-testid="page-messages">
      <div className="border-b p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Messages
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Communicate with builders about your projects
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full py-4">
            <Card className="overflow-hidden flex flex-col">
              <div className="border-b p-4">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatList
                  userId={client.id}
                  userType="client"
                  onSelectThread={setSelectedThread}
                  selectedThreadId={selectedThread?.id}
                />
              </div>
            </Card>

            <Card className="md:col-span-2 overflow-hidden">
              {selectedThread ? (
                <ChatThread
                  thread={selectedThread}
                  userId={client.id}
                  userType="client"
                />
              ) : (
                <div className="flex items-center justify-center h-full p-8" data-testid="no-conversation-selected">
                  <EmptyState
                    icon={MessageCircle}
                    title="No conversation selected"
                    description="Select a conversation from the list to start chatting with a builder"
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
