'use client';

import { useState } from 'react';
import AppHeader from '@/components/app/header';
import {
  conversations as initialConversations,
  chatMessages as initialChatMessages,
  users as allUsers,
} from '@/lib/data';
import type { Conversation, ChatMessage, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      conversationId: selectedConversation.id,
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    toast({
      title: 'Message Sent (Simulated)',
      description: 'In a real app, this would be sent to the recipient.',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const foundUser = Object.values(allUsers).find(
      (user) => user.email.toLowerCase() === searchTerm.toLowerCase()
    );

    if (foundUser) {
      const existingConvo = conversations.find(
        (convo) => convo.participantName === foundUser.name
      );

      if (existingConvo) {
        setSelectedConversation(existingConvo);
      } else {
        const newConvo: Conversation = {
          id: `CONV-${Date.now()}`,
          participantName: foundUser.name,
          participantRole: foundUser.role,
          lastMessage: 'New conversation started.',
          lastMessageTimestamp: new Date().toISOString(),
          unreadCount: 0,
          avatarUrl: `https://picsum.photos/seed/${foundUser.id}/100/100`,
        };
        setConversations([newConvo, ...conversations]);
        setSelectedConversation(newConvo);
      }
      setSearchTerm('');
    } else {
      toast({
        variant: 'destructive',
        title: 'User Not Found',
        description: `No user with the email "${searchTerm}" is registered.`,
      });
    }
  };

  const currentMessages = messages.filter((m) => m.conversationId === selectedConversation?.id);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <AppHeader title="Messages" />
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="w-1/4 min-w-[250px] max-w-[350px] border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold">Chats</h2>
            <form onSubmit={handleSearch} className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <nav className="flex flex-col gap-1 p-2">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConversation(convo)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-muted',
                  selectedConversation?.id === convo.id && 'bg-muted font-semibold'
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={convo.avatarUrl} alt={convo.participantName} />
                  <AvatarFallback>{convo.participantName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="font-medium">{convo.participantName}</p>
                  <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                {convo.unreadCount > 0 && (
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {convo.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Chat Panel */}
        <main className="flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <header className="flex items-center gap-4 border-b bg-muted/40 px-6 h-16">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.avatarUrl}
                    alt={selectedConversation.participantName}
                  />
                  <AvatarFallback>
                    {selectedConversation.participantName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedConversation.participantName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.participantRole}
                  </p>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col gap-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2',
                        msg.sender === 'You' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.sender !== 'You' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={selectedConversation.avatarUrl}
                            alt={selectedConversation.participantName}
                          />
                          <AvatarFallback>
                            {selectedConversation.participantName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                          msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={cn(
                            'text-xs mt-1',
                            msg.sender === 'You'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          )}
                        >
                          {format(new Date(msg.timestamp), 'p')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <footer className="border-t bg-muted/40 p-4">
                <form className="relative" onSubmit={handleSendMessage}>
                  <Input
                    placeholder="Type your message..."
                    className="pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2"
                  >
                    <SendHorizonal className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
