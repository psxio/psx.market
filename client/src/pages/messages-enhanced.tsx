import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { ChatThread } from "@/components/chat-thread";
import {
  MessageCircle,
  Wallet,
  Search,
  Archive,
  Trash2,
  MoreVertical,
  Star,
  StarOff,
  ExternalLink,
  X,
  Menu,
  Phone,
  Video,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { ChatThread as ChatThreadType, Builder, Client, Order } from "@shared/schema";

interface ChatThreadWithDetails extends ChatThreadType {
  builder?: Builder;
  client?: Client;
  order?: Order | null;
}

export default function MessagesEnhanced() {
  const { address, isConnected } = useAccount();
  const { client } = useClientAuth();
  const [, setLocation] = useLocation();
  const [selectedThread, setSelectedThread] = useState<ChatThreadWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);

  const userId = (client?.id || address) as string;

  const { data: threads = [], isLoading } = useQuery<ChatThreadWithDetails[]>({
    queryKey: ["/api/chat/threads", userId, "client"],
    queryFn: async () => {
      const res = await fetch(`/api/chat/threads?userId=${userId}&userType=client`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
    enabled: !!userId,
  });

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto p-8 text-center max-w-md">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              You need to connect your wallet to access messages and communicate with builders
            </p>
          </div>
          <ConnectButton />
        </div>
      </div>
    );
  }

  // Filter threads based on search query
  const filteredThreads = threads.filter((thread) => {
    const otherUser = thread.builder;
    const matchesSearch =
      !searchQuery ||
      otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessagePreview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const ConversationList = () => (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Conversations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStarredOnly(!starredOnly)}
            className="md:hidden"
          >
            {starredOnly ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-conversations"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-4">
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
        ) : filteredThreads.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={searchQuery ? Search : MessageCircle}
              title={searchQuery ? "No conversations found" : "No conversations yet"}
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : "Start a conversation with a builder to discuss your project"
              }
            />
          </div>
        ) : (
          <div className="space-y-2 p-4" data-testid="chat-list">
            {filteredThreads.map((thread) => {
              const otherUser = thread.builder;
              const unreadCount = thread.clientUnreadCount;
              const isSelected = thread.id === selectedThread?.id;

              return (
                <Card
                  key={thread.id}
                  className={`p-4 cursor-pointer transition-colors hover-elevate ${
                    isSelected ? "border-primary bg-accent" : ""
                  }`}
                  onClick={() => {
                    setSelectedThread(thread);
                    setMobileMenuOpen(false);
                  }}
                  data-testid={`chat-thread-${thread.id}`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser?.profileImage || undefined} />
                        <AvatarFallback>
                          {otherUser?.name?.substring(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      {otherUser?.verified && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-[8px] text-primary-foreground">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">
                          {otherUser?.name || "Unknown User"}
                        </h4>
                        {thread.lastMessageAt && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(thread.lastMessageAt), {
                              addSuffix: true,
                            })}
                          </span>
                        )}
                      </div>

                      {thread.order && (
                        <p className="text-xs text-muted-foreground mb-1 truncate">
                          Order: {thread.order.title}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {thread.lastMessagePreview || "No messages yet"}
                        </p>
                        {unreadCount > 0 && (
                          <Badge variant="default" className="shrink-0" data-testid={`unread-count-${thread.id}`}>
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Star className="h-4 w-4 mr-2" />
                          Star conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col" data-testid="page-messages">
      <div className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[80vw] max-w-sm">
                <ConversationList />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Messages
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Communicate with builders about your projects
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full py-4">
            <Card className="overflow-hidden flex-col hidden md:flex">
              <ConversationList />
            </Card>

            <Card className="md:col-span-2 overflow-hidden flex flex-col">
              {selectedThread ? (
                <>
                  <div className="border-b p-4 bg-card">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={selectedThread.builder?.profileImage || undefined} />
                          <AvatarFallback>
                            {selectedThread.builder?.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate" data-testid="thread-title">
                              {selectedThread.builder?.name || "Unknown Builder"}
                            </h3>
                            {selectedThread.builder?.verified && (
                              <Badge variant="secondary" className="shrink-0 text-xs">
                                <span className="mr-1">✓</span>Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {selectedThread.builder?.category && (
                              <span className="truncate">{selectedThread.builder.category}</span>
                            )}
                            {selectedThread.builder?.rating && (
                              <>
                                <span>•</span>
                                <span className="shrink-0">
                                  ⭐ {selectedThread.builder.rating.toFixed(1)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setLocation(`/builder/${selectedThread.builderId}`)
                          }
                          title="View profile"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              Star conversation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete conversation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatThread thread={selectedThread} userId={userId} userType="client" />
                  </div>
                </>
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
