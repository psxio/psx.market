import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatThread, Builder, Client, Order } from "@shared/schema";

interface ChatThreadWithDetails extends ChatThread {
  builder?: Builder;
  client?: Client;
  order?: Order | null;
}

interface ChatListProps {
  userId: string;
  userType: "client" | "builder";
  onSelectThread: (thread: ChatThreadWithDetails) => void;
  selectedThreadId?: string;
}

export function ChatList({ userId, userType, onSelectThread, selectedThreadId }: ChatListProps) {
  const { data: threads, isLoading } = useQuery<ChatThreadWithDetails[]>({
    queryKey: ["/api/chat/threads", userId, userType],
    queryFn: async () => {
      const res = await fetch(`/api/chat/threads?userId=${userId}&userType=${userType}`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2 p-4" data-testid="chat-list-loading">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center" data-testid="chat-list-empty">
        <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          {userType === "client" 
            ? "Start a conversation with a builder to discuss your project"
            : "Your client conversations will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4" data-testid="chat-list">
      {threads.map((thread) => {
        const otherUser = userType === "client" ? thread.builder : thread.client;
        const unreadCount = userType === "client" 
          ? thread.clientUnreadCount 
          : thread.builderUnreadCount;
        const isSelected = thread.id === selectedThreadId;

        return (
          <Card
            key={thread.id}
            className={`p-4 cursor-pointer transition-colors hover-elevate ${
              isSelected ? "border-primary bg-accent" : ""
            }`}
            onClick={() => onSelectThread(thread)}
            data-testid={`chat-thread-${thread.id}`}
          >
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherUser?.profileImage || undefined} />
                <AvatarFallback>
                  {otherUser?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold truncate">
                    {otherUser?.name || "Unknown User"}
                  </h4>
                  {thread.lastMessageAt && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(thread.lastMessageAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                
                {thread.order && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Order: {thread.order.title}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {thread.lastMessagePreview || "No messages yet"}
                  </p>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2" data-testid={`unread-count-${thread.id}`}>
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
