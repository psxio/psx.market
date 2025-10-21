import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Check, CheckCheck, Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useWebSocket } from "@/hooks/use-websocket";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Message, MessageAttachment, ChatThread, Builder, Client, Order } from "@shared/schema";

interface MessageWithAttachments extends Message {
  attachments?: MessageAttachment[];
}

interface ChatThreadWithDetails extends ChatThread {
  builder?: Builder;
  client?: Client;
  order?: Order | null;
}

interface ChatThreadProps {
  thread: ChatThreadWithDetails;
  userId: string;
  userType: "client" | "builder";
}

export function ChatThread({ thread, userId, userType }: ChatThreadProps) {
  const { toast } = useToast();
  const [messageContent, setMessageContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: messages, isLoading } = useQuery<MessageWithAttachments[]>({
    queryKey: ["/api/chat/threads", thread.id, "messages"],
    queryFn: async () => {
      const res = await fetch(`/api/chat/threads/${thread.id}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/chat/messages`, {
        threadId: thread.id,
        senderId: userId,
        senderType: userType,
        content,
        messageType: "text",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/threads", thread.id, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/threads", userId, userType] });
      setMessageContent("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/chat/threads/${thread.id}/mark-read`, {
        readerId: userId,
        readerType: userType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/threads", userId, userType] });
    },
  });

  const { isConnected, sendMessage: sendWSMessage } = useWebSocket({
    userId,
    userType,
    threadId: thread.id,
    onMessage: (wsMessage) => {
      if (wsMessage.type === "message") {
        queryClient.invalidateQueries({ queryKey: ["/api/chat/threads", thread.id, "messages"] });
        queryClient.invalidateQueries({ queryKey: ["/api/chat/threads", userId, userType] });
        
        if (wsMessage.data.senderId !== userId) {
          sendWSMessage({
            type: "read_receipt",
            messageId: wsMessage.data.id,
            threadId: thread.id,
            readerId: userId,
            readerType: userType,
          });
        }
      } else if (wsMessage.type === "typing") {
        if (wsMessage.userId !== userId) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        }
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [messages?.length]);

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;

    if (isConnected) {
      sendWSMessage({
        type: "message",
        threadId: thread.id,
        senderId: userId,
        senderType: userType,
        content: messageContent.trim(),
        messageType: "text",
      });
      setMessageContent("");
    } else {
      sendMessageMutation.mutate(messageContent.trim());
    }
  };

  const handleTyping = () => {
    if (isConnected) {
      sendWSMessage({
        type: "typing",
        threadId: thread.id,
        userId,
        userType,
      });
    }
  };

  const otherUser = userType === "client" ? thread.builder : thread.client;

  return (
    <div className="flex flex-col h-full" data-testid="chat-thread">
      <div className="border-b p-4 bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.profileImage || undefined} />
            <AvatarFallback>
              {otherUser?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold" data-testid="thread-title">{thread.title}</h3>
            <p className="text-sm text-muted-foreground">
              {otherUser?.name}
              {isConnected && (
                <Badge variant="outline" className="ml-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                  Online
                </Badge>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-container">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => {
            const isOwnMessage = message.senderId === userId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.id}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <Card className={`p-3 ${isOwnMessage ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs hover:underline"
                          >
                            <Paperclip className="h-3 w-3" />
                            {attachment.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                  </Card>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                    <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
                    {isOwnMessage && (
                      message.edited ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation!</p>
            </div>
          </div>
        )}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>{otherUser?.name} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-card">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message..."
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="resize-none min-h-[60px]"
            data-testid="input-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || sendMessageMutation.isPending}
            size="icon"
            className="h-[60px] w-[60px]"
            data-testid="button-send-message"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
