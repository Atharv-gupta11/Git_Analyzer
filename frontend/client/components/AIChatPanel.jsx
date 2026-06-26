import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Paperclip, Trash2, Bot, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepo } from "../context/RepoContext";
import { api } from "../api/api";

export function AIChatPanel({ onToggleRepositoryPanel }) {
  const { currentRepo } = useRepo();
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Repository Assistant. I can help you understand, analyze, and improve any GitHub repository. Ask me anything about the code, architecture, potential bugs, or improvements.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !currentRepo) return;

    const userMessage = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.analyzeRepo(currentRepo.repo_name, userMessage.content);
      const assistantMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error while analyzing your question. Please ensure the repository is analyzed/indexed first.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your Repository Assistant. I can help you understand, analyze, and improve any GitHub repository. Ask me anything about the code, architecture, potential bugs, or improvements.",
        timestamp: new Date(),
      },
    ]);
  };

  if (!currentRepo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background border-l border-border h-screen text-muted-foreground p-8 text-center">
        <div className="w-16 h-16 bg-sidebar-accent rounded-full flex items-center justify-center mb-6">
          <FolderOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Repository Selected</h2>
        <p className="text-sm max-w-sm">
          Please select a repository from the sidebar or add a new one to start exploring its architecture and asking questions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background border-l border-border h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Repository Assistant
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Asking about: {currentRepo.repo_name}
          </p>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-2xl rounded-lg p-4",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border",
              )}
            >
              {message.role === "assistant" ? (
                <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
              <p
                className={cn(
                  "text-xs mt-2",
                  message.role === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-2xl rounded-lg p-4 bg-card text-foreground border border-border flex items-center gap-3">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border bg-background">
        <div className="flex gap-3 items-end">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2 items-center bg-card border border-border rounded-lg p-4 focus-within:border-primary transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about this repository..."
                className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder-muted-foreground"
                disabled={isTyping}
              />

              <button className="p-2 hover:bg-sidebar-accent rounded transition-colors text-muted-foreground hover:text-foreground">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
