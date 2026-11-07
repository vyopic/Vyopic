import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Square,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Moon,
  Sun,
  Bot,
  User,
  Sparkles,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowDown,
  Terminal,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { TOOLS } from '../config/tools';
import { ToolLayout } from '../components/common/ToolLayout';
import { MarkdownContent } from '../components/chat/MarkdownContent';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STARTER_PROMPTS = [
  {
    lang: 'bn',
    label: 'ছবি এডিটিং টিপস',
    text: 'ছবি এডিটিং করার সময় লাইটিং এবং কনট্রাস্ট কিভাবে নিখুঁত রাখা যায়?'
  },
  {
    lang: 'bn',
    label: 'ব্যাকগ্রাউন্ড রিমুভ',
    text: 'Vyopic দিয়ে ছবির ব্যাকগ্রাউন্ড রিমুভ করে পাসপোর্ট সাইজ ছবি বানানোর নিয়ম বলো।'
  },
  {
    lang: 'bn',
    label: 'ব্র্যান্ড লোগো তৈরি',
    text: 'আমার নতুন অনলাইন ব্যবসার জন্য আকর্ষণীয় ব্র্যান্ড লোগো এবং কালার কম্বিনেশন আইডিয়া দাও।'
  },
  {
    lang: 'en',
    label: 'Logo Design Guide',
    text: 'How can I design a minimal modern brand logo using Vyopic Name Brand Logo Maker?'
  },
  {
    lang: 'en',
    label: 'Photo Upscaling',
    text: 'Explain how bicubic upscaling and AI sharpness enhancement preserve photo details.'
  },
  {
    lang: 'en',
    label: 'Social Media Caption',
    text: 'Write 3 catchy Instagram captions with hashtags for a portrait photography post.'
  }
];

const STORAGE_KEY = 'vyopic_ai_chat_sessions_v2';
const THEME_STORAGE_KEY = 'vyopic_chat_theme';

export const AIChatAssistantPage: React.FC = () => {
  const tool = TOOLS.find((t) => t.id === 'ai-chat-assistant') || TOOLS[0];

  // State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Load initial sessions and theme
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }

    // Sessions
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved chat sessions:', e);
    }

    // Create initial session if none
    const initialSession: ChatSession = {
      id: `chat_${Date.now()}`,
      title: 'নতুন কথোপকথন / New Chat',
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'assistant',
          content: `👋 **স্বাগতম! Welcome to Vyopic AI Chat Assistant!**\n\nআমি Vyopic-এর বুদ্ধিমান এআই সহকারী। আমি **বাংলা ও ইংরেজি (Bengali & English)** উভয় ভাষাতেই সাবলীলভাবে কথা বলতে পারি।\n\n🔹 **আমি যা যা করতে পারি:**\n- ছবির এডিটিং, ব্যাকগ্রাউন্ড রিমুভাল ও ফটো এনহ্যান্সমেন্ট টিপস\n- ব্র্যান্ড লোগো ডিজাইন আইডিয়া ও ফ্রেম নির্বাচন\n- সোশ্যাল মিডিয়া ক্যাপশন, কন্টেন্ট রাইটিং ও অনুবাদ\n- প্রোগ্রামিং কোড, ডিবাগিং এবং সাধারণ প্রশ্নোত্তর\n\nনিচের যেকোনো প্রম্পটে ক্লিক করে শুরু করতে পারেন অথবা আপনার প্রশ্নটি নিচে লিখুন!`,
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
  }, []);

  // 2. Persist sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (err) {
        console.warn('Failed to save chat sessions to localStorage:', err);
      }
    }
  }, [sessions]);

  // 3. Theme Toggle
  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme ? 'dark' : 'light');
  };

  // Active Session Helper
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isGenerating]);

  // Handle textarea auto height
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    if (isGenerating) {
      handleStopGeneration();
    }
    const newSession: ChatSession = {
      id: `chat_${Date.now()}`,
      title: 'নতুন কথোপকথন / New Chat',
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'assistant',
          content: `👋 **স্বাগতম! Welcome to Vyopic AI Chat Assistant!**\n\nআমি কীভাবে আপনাকে সাহায্য করতে পারি? যেকোনো প্রশ্ন বাংলায় বা ইংরেজিতে জিজ্ঞাসা করতে পারেন।`,
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setErrorMessage(null);
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== sessionId);
    if (remaining.length === 0) {
      handleNewChat();
      return;
    }
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0].id);
    }
  };

  // Copy assistant response
  const handleCopyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputMessage;
    const trimmed = rawText.trim();
    if (!trimmed || isGenerating) return;

    setErrorMessage(null);
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now()
    };

    // Auto title if first message
    const updatedMessages = [...(currentSession?.messages || []), userMessage];
    let sessionTitle = currentSession?.title || 'Chat';
    if (currentSession?.messages.length <= 1) {
      sessionTitle = trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '');
    }

    // Update active session with user message
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: sessionTitle,
              messages: updatedMessages,
              updatedAt: Date.now()
            }
          : s
      )
    );

    // Prepare assistant placeholder message
    const assistantMessageId = `asst_${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...updatedMessages, initialAssistantMessage] }
          : s
      )
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      // Build conversation history for /api/chat
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationHistory,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        let errJson: any;
        try {
          errJson = await response.json();
        } catch {
          errJson = { error: `Request failed with status ${response.status}` };
        }

        if (response.status === 503 && errJson?.error?.includes('GROQ_API_KEY')) {
          setShowConfigModal(true);
        }

        throw new Error(errJson?.error || errJson?.details || `Server responded with ${response.status}`);
      }

      // Check if response is Server-Sent Events stream or JSON
      const contentType = response.headers.get('content-type') || '';
      let accumulatedContent = '';

      if (contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('data: ')) {
                const dataStr = trimmedLine.slice(6);
                if (dataStr === '[DONE]') {
                  done = true;
                  break;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  const delta = parsed?.choices?.[0]?.delta?.content || '';
                  if (delta) {
                    accumulatedContent += delta;
                    // Real-time UI update
                    setSessions((prev) =>
                      prev.map((s) =>
                        s.id === activeSessionId
                          ? {
                              ...s,
                              messages: s.messages.map((m) =>
                                m.id === assistantMessageId
                                  ? { ...m, content: accumulatedContent }
                                  : m
                              )
                            }
                          : s
                      )
                    );
                  }
                } catch {
                  // Incomplete JSON in chunk, will parse next
                }
              }
            }
          }
        }
      } else {
        // Standard JSON response
        const data = await response.json();
        accumulatedContent = data?.message?.content || data?.choices?.[0]?.message?.content || '';
      }

      if (!accumulatedContent) {
        accumulatedContent = 'আমি আপনার বার্তাটি গ্রহণ করেছি। দয়া করে পুনরায় লিখুন অথবা আবার চেষ্টা করুন।';
      }

      // Final update
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedContent }
                    : m
                ),
                updatedAt: Date.now()
              }
            : s
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Chat generation aborted by user.');
        return;
      }
      console.error('Chat generation error:', err);
      const errMsg = err.message || 'একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      setErrorMessage(errMsg);

      // Remove empty assistant placeholder if failed completely
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId && !m.content
                    ? {
                        ...m,
                        content: `⚠️ **ত্রুটি / Error:** ${errMsg}\n\nদয়া করে Cloudflare Pages Environment Variables-এ \`GROQ_API_KEY\` সেট করা আছে কিনা যাচাই করুন।`
                      }
                    : m
                )
              }
            : s
        )
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (!currentSession || isGenerating) return;
    const msgs = currentSession.messages;
    if (msgs.length < 2) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const trimmedHistory = msgs.slice(0, lastUserIndex);
    const lastUserPrompt = msgs[lastUserIndex].content;

    // Replace session messages up to the user message
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: trimmedHistory
            }
          : s
      )
    );

    // Re-send
    handleSendMessage(lastUserPrompt);
  };

  // Handle Enter key submit (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* TOP BANNER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white p-6 sm:p-7 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Groq API • Llama 3.3 70B • Cloudflare Pages Functions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Vyopic AI Chat Assistant
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              আপনার যেকোনো প্রশ্ন, ছবি এডিটিং পরামর্শ, লোগো ডিজাইন আইডিয়া ও টেকনিক্যাল সমাধানের জন্য তৈরি আধুনিক এআই সহকারী। বাংলা ও ইংরেজি উভয় ভাষায় নির্ভুল উত্তর পান।
            </p>
          </div>
        </div>

        {/* ERROR ALERT */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Setup Info
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* CHAT CONTAINER BOX */}
        <div
          className={`rounded-3xl border shadow-sm overflow-hidden flex flex-col md:flex-row h-[720px] transition-colors duration-200 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* SIDEBAR: CHAT SESSIONS & HISTORY */}
          <div
            className={`transition-all duration-300 flex flex-col border-b md:border-b-0 md:border-r ${
              isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/70'
            } ${
              isSidebarOpen ? 'w-full md:w-72 shrink-0' : 'hidden md:flex md:w-0 overflow-hidden'
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Chat History
                </span>
              </div>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Start a new chat"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setErrorMessage(null);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? isDarkMode
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                          : 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-blue-500" />
                      <span className="truncate">{session.title}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity rounded"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-inherit text-[11px] text-slate-400 flex items-center justify-between">
              <span>{sessions.length} Chat{sessions.length > 1 ? 's' : ''} Saved</span>
              <button
                onClick={() => setShowConfigModal(true)}
                className="hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3 h-3" />
                <span>API Settings</span>
              </button>
            </div>
          </div>

          {/* MAIN CHAT STAGE */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* CHAT HEADER CONTROLS */}
            <div
              className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between ${
                isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-white/90'
              } backdrop-blur-xs`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-800 hover:bg-slate-800 text-slate-400'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title={isSidebarOpen ? 'Collapse sidebar' : 'Open history sidebar'}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <PanelLeftOpen className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold leading-tight">Vyopic AI Assistant</h2>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Groq Cloudflare API</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: New Chat & Theme */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewChat}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-800 text-yellow-400 hover:bg-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* MESSAGES SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {currentSession?.messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 relative group transition-all ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                          : isDarkMode
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-xs shadow-xs'
                          : 'bg-slate-50 text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed select-text font-normal">
                          {message.content}
                        </p>
                      ) : message.content ? (
                        <MarkdownContent content={message.content} isDark={isDarkMode} />
                      ) : (
                        // Typing indicator for empty response while waiting
                        <div className="flex items-center gap-1.5 py-1 text-slate-400 text-xs">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                          <span
                            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                            style={{ animationDelay: '0.15s' }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                            style={{ animationDelay: '0.3s' }}
                          />
                          <span className="ml-2 text-[11px] font-medium">চিন্তা করছে... / Generating...</span>
                        </div>
                      )}

                      {/* Bubble Action Bar (Copy & Regenerate for Assistant) */}
                      {!isUser && message.content && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px] text-slate-400">
                          <button
                            onClick={() => handleCopyMessage(message.content, message.id)}
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer py-0.5 px-1.5 rounded"
                            title="Copy response"
                          >
                            {copiedMessageId === message.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500 font-semibold">কপি হয়েছে!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Response</span>
                              </>
                            )}
                          </button>

                          {/* Regenerate if this is the last message */}
                          {message.id ===
                            currentSession.messages[currentSession.messages.length - 1].id &&
                            !isGenerating && (
                              <button
                                onClick={handleRegenerate}
                                className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer py-0.5 px-1.5 rounded"
                                title="Regenerate this response"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Regenerate</span>
                              </button>
                            )}
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK STARTER PROMPT CHIPS (Shows when only welcome message exists) */}
            {currentSession?.messages.length <= 1 && (
              <div className="px-4 sm:px-6 pb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  সুপারিশকৃত প্রম্পট / Suggested Prompts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {STARTER_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.text)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2 cursor-pointer ${
                        isDarkMode
                          ? 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-blue-500 text-slate-300'
                          : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-xs text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[11px] block text-blue-600 dark:text-blue-400">
                          {p.label}
                        </span>
                        <span className="line-clamp-1 text-[11px] opacity-80">{p.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INPUT COMPOSER BAR */}
            <div
              className={`p-3 sm:p-4 border-t ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
              }`}
            >
              {/* Stop Generation Button */}
              {isGenerating && (
                <div className="flex justify-center mb-2">
                  <button
                    onClick={handleStopGeneration}
                    className="flex items-center gap-1.5 px-3.5 py-1 bg-slate-800 text-white text-xs font-bold rounded-full shadow-md hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current text-rose-400" />
                    <span>Stop Generation</span>
                  </button>
                </div>
              )}

              <div
                className={`flex items-end gap-2 p-2 rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-800/90 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
                    : 'border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20'
                }`}
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask in Bengali or English (e.g. ছবি এডিটিং টিপস বা লোগো আইডিয়া)..."
                  className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm focus:outline-none max-h-36 py-1.5 px-2"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-2">
                <span>Shift + Enter for new line • Enter to send</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Cloudflare Secured API
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: GROQ API SETUP INSTRUCTIONS */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className={`max-w-lg w-full rounded-3xl p-6 border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold">Cloudflare Pages Groq API Setup</h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                এই AI Chat Assistant-টি Cloudflare Pages Functions (<code>/api/chat</code>) এর মাধ্যমে Groq API দিয়ে পরিচালিত হয়। Cloudflare Pages-এ ডিপ্লয় করার সময় নিচের ভ্যারিয়েবল দুটি সেট করে দিন:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                  <p className="font-bold text-blue-600 dark:text-blue-400">1. GROQ_API_KEY (Secret)</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    console.groq.com থেকে তৈরি করা বিনামূল্যে Groq API Key (gsk_...)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                  <p className="font-bold text-blue-600 dark:text-blue-400">2. GROQ_MODEL (Text)</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ডিফল্ট: <code>llama-3.3-70b-versatile</code> (অথবা <code>llama-3.1-8b-instant</code>)
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-900/50">
                <strong>কিভাবে Cloudflare Pages-এ যুক্ত করবেন:</strong><br />
                Cloudflare Dashboard ➔ Workers & Pages ➔ আপনার Project ➔ Settings ➔ Environment variables ➔ <strong>Add variable</strong> (GROQ_API_KEY Secret হিসেবে এবং GROQ_MODEL Text হিসেবে)।
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  বুঝেছি / Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
