import { UniversalComposer } from "./UniversalComposer";
import { useState, useEffect, useRef, useCallback, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import {
  Presentation,
  Palette,
  BookOpen,
  BarChart,
  MessageSquareText,
  Bot,
  User,
} from 'lucide-react';
import { chatCompletion, type ChatMessage } from '@workspace/api-client-react';
import { useSpeechSettings, getVoiceErrorMessage } from '@/lib/speechSettings';
import { cn } from '@/lib/utils';

// Prevent unbounded growth of the in-memory voice history. The server also
// trims, but we bound on the client too so a long-running tab doesn't keep
// shipping a giant payload over the wire.
const MAX_CLIENT_HISTORY = 30;

interface ChatViewProps {
  chatMessages: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  selectedAgentId?: string | null;
  onSelectedAgentIdChange?: (agentId: string | null) => void;
}

export function ChatView({
  chatMessages,
  setChatMessages,
  selectedAgentId,
  onSelectedAgentIdChange,
}: ChatViewProps) {
  const [greeting, setGreeting] = useState('');
  const speechSettings = useSpeechSettings();
  // Mirror the lifted chat thread into a ref so the memoised voice callback
  // always reads the latest history without re-creating the callback on
  // every turn (which would re-mount the speech recogniser).
  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;
  // Mirror the latest language setting into a ref so the (memoised)
  // getVoiceReply callback always uses the current locale without being
  // re-created — recreating it would re-mount the speech recogniser.
  const recognitionLangRef = useRef(speechSettings.recognitionLang);
  recognitionLangRef.current = speechSettings.recognitionLang;
  // Auto-scroll the thread to the latest message as turns arrive.
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const getVoiceReply = useCallback(async (transcript: string): Promise<string> => {
    const userMessage: ChatMessage = { role: 'user', content: transcript };
    // Show the user's transcript in the visible thread immediately, even if
    // the assistant reply is delayed or fails.
    setChatMessages(prev => [...prev, userMessage]);
    const history = [...chatMessagesRef.current, userMessage].slice(-MAX_CLIENT_HISTORY);
    try {
      const { reply } = await chatCompletion({
        messages: history,
        language: recognitionLangRef.current,
        agentId: selectedAgentId || undefined,
      });
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      setChatMessages(prev => [...prev, assistantMessage]);
      return reply;
    } catch (err) {
      // Don't poison the history with a failed turn — just speak a fallback.
      console.error('Voice chat completion failed', err);
      return getVoiceErrorMessage(recognitionLangRef.current);
    }
  }, [selectedAgentId, setChatMessages]);

  const sendTypedPrompt = useCallback(async (prompt: string, agentId?: string): Promise<void> => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setChatMessages(prev => [...prev, userMessage]);
    const history = [...chatMessagesRef.current, userMessage].slice(-MAX_CLIENT_HISTORY);
    try {
      const { reply } = await chatCompletion({
        messages: history,
        language: recognitionLangRef.current,
        agentId,
      });
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Typed chat completion failed', err);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: getVoiceErrorMessage(recognitionLangRef.current),
        },
      ]);
    }
  }, [setChatMessages]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning, Alex');
    else if (hour < 17) setGreeting('Good afternoon, Alex');
    else setGreeting('Golden hour thinking');
  }, []);

  // Scroll to bottom whenever a new message lands so the user always sees
  // the latest exchange — important when voice is producing turns rapidly.
  useEffect(() => {
    if (chatMessages.length === 0) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages.length]);

  const suggestions = [
    { icon: <Presentation className="w-4 h-4" />, label: 'Create slide deck' },
    { icon: <Palette className="w-4 h-4" />, label: 'Design system' },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Document to skill' },
    { icon: <BarChart className="w-4 h-4" />, label: 'Analyze data' },
  ];

  const recentChats = [
    { title: 'Landing page copy analysis', time: '2 hours ago' },
    { title: 'Q3 Financial metrics parsing', time: 'Yesterday' },
    { title: 'Brainstorming product names', time: '2 days ago' },
  ];

  const hasMessages = chatMessages.length > 0;

  // Active conversation: thread on top, composer pinned below. Distinct from
  // the "empty / hero" layout so the user gets an obviously-different chat
  // surface once a conversation is in flight.
  if (hasMessages) {
    return (
      <div className="w-full h-full flex flex-col max-w-[820px] mx-auto px-4 sm:px-6">
        <div
          className="flex-1 overflow-y-auto py-8 flex flex-col gap-4"
          data-testid="chat-thread"
        >
          {chatMessages.map((msg, i) => (
            <ChatBubble key={i} message={msg} index={i} />
          ))}
          <div ref={scrollAnchorRef} />
        </div>
        <div className="pb-6 pt-2 sticky bottom-0 bg-[#FAFAFA]">
          <UniversalComposer
            suggestions={suggestions}
            onSubmit={(value: string) => {
              void sendTypedPrompt(value, selectedAgentId || undefined);
            }}
            getVoiceReply={getVoiceReply}
            speechLang={speechSettings.recognitionLang}
            speechVoiceURI={speechSettings.ttsVoiceURI}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-6 sm:p-12 relative max-w-[1140px] mx-auto py-20">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="text-[32px] font-bold text-foreground tracking-tight mb-2">
          {greeting}
        </h1>
        <p className="text-muted-foreground font-medium text-[15px]">
          How can I help you progress today?
        </p>
      </motion.div>

      {/* Input Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-[820px] mb-12"
      >
        <UniversalComposer
          suggestions={suggestions}
          onSubmit={(value: string) => {
            void sendTypedPrompt(value, selectedAgentId || undefined);
          }}
          getVoiceReply={getVoiceReply}
          speechLang={speechSettings.recognitionLang}
          speechVoiceURI={speechSettings.ttsVoiceURI}
        />
      </motion.div>

      {/* Recent Conversations */}
      <div className="w-full max-w-[600px] mt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Recent</h3>
        <div className="flex flex-col gap-1">
          {recentChats.map((chat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 text-left group border border-transparent hover:border-border"
              data-testid={`recent-chat-${i}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f5f5f5] rounded-lg group-hover:bg-primary/10 transition-colors duration-200">
                  <MessageSquareText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>
                <span className="font-medium text-sm text-foreground">{chat.title}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{chat.time}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
  index: number;
}

function ChatBubble({ message, index }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3 items-start',
        isUser ? 'justify-end' : 'justify-start'
      )}
      data-testid={`chat-message-${index}`}
      data-role={message.role}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'
        )}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}

