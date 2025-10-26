import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: string;
  createdAt: string;
  messageType?: string;
}

interface Thread {
  id: string;
  participantName: string;
  participantImage?: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

interface MobileChatProps {
  thread: Thread;
  messages: Message[];
  currentUserId: string;
  currentUserType: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

export function MobileChat({
  thread,
  messages,
  currentUserId,
  currentUserType,
  onSendMessage,
  onBack,
}: MobileChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden" data-testid="mobile-chat">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b bg-card">
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack}
          data-testid="mobile-chat-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage src={thread.participantImage} />
          <AvatarFallback>
            {thread.participantName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{thread.participantName}</p>
          {isTyping && (
            <p className="text-xs text-muted-foreground">typing...</p>
          )}
        </div>

        <Button size="icon" variant="ghost" data-testid="mobile-chat-options">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId && message.senderType === currentUserType;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              data-testid={`message-${message.id}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p
                  className={`text-[10px] mt-1 ${
                    isOwn
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-3">
        <div className="flex items-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            data-testid="mobile-chat-attach"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none rounded-2xl border bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[42px] max-h-[120px]"
              rows={1}
              data-testid="mobile-chat-input"
            />
          </div>

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="shrink-0 h-[42px] w-[42px] rounded-full"
            data-testid="mobile-chat-send"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Mobile Thread List Component
interface MobileThreadListProps {
  threads: Thread[];
  onSelectThread: (thread: Thread) => void;
}

export function MobileThreadList({ threads, onSelectThread }: MobileThreadListProps) {
  return (
    <div className="md:hidden" data-testid="mobile-thread-list">
      {threads.map((thread) => (
        <button
          key={thread.id}
          onClick={() => onSelectThread(thread)}
          className="w-full flex items-center gap-3 px-4 py-3 hover-elevate active-elevate-2 border-b"
          data-testid={`thread-${thread.id}`}
        >
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={thread.participantImage} />
            <AvatarFallback>
              {thread.participantName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-semibold text-sm truncate">
                {thread.participantName}
              </p>
              {thread.lastMessageAt && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(thread.lastMessageAt), {
                    addSuffix: false,
                  })}
                </span>
              )}
            </div>
            {thread.lastMessage && (
              <p className="text-sm text-muted-foreground truncate">
                {thread.lastMessage}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
