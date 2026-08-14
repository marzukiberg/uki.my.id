import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Bot,
  Minimize2,
  ExternalLink,
  Code2,
  Briefcase,
  Layers
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo, saya asisten AI Marzuki. Anda dapat bertanya seputar pengalaman kerja, teknologi yang digunakan, portfolio proyek, atau informasi kontak.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Placeholder message for assistant streaming output
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedContent = "";
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep trailing partial line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                const token = parsed.choices?.[0]?.delta?.content || "";
                if (token) {
                  streamedContent += token;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: streamedContent,
                    };
                    return updated;
                  });
                }
              } catch (e) {
                // Ignore incomplete SSE chunk
              }
            }
          }
        }
      }

      if (!streamedContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Maaf, tidak ada respon yang diterima.",
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Terjadi kesalahan: ${err.message || "Gagal memproses permintaan. Silakan coba lagi."}`,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
  };

  return (
    <>
      {/* Floating Action Button with Smooth Scale Transition */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Tutup AI Assistant" : "Buka AI Assistant"}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#1a73e8] text-white shadow-lg transition-all duration-300 ease-out hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 ${
            isOpen ? "rotate-90 scale-90 opacity-0 pointer-events-none" : "rotate-0 scale-100 opacity-100"
          }`}
        >
          <Sparkles className="h-6 w-6" />
        </button>
      </div>

      {/* Floating Chat Modal with Smooth Scale, Opacity & Slide Transition */}
      <div
        className={`fixed bottom-6 right-4 sm:right-6 z-50 flex h-[540px] max-h-[85vh] w-[92vw] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-6 scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header (Google Style) */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#f8f9fa] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[#1a73e8]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#202124] flex items-center gap-1.5">
                Marzuki AI Assistant
                <span className="rounded bg-blue-100 px-1 py-0.2 text-[9px] font-bold text-blue-700">
                  AI
                </span>
              </h3>
              <p className="text-[10px] text-[#5f6368]">
                Tanya seputar pengalaman &amp; portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "Halo, ada yang ingin Anda tanyakan seputar pengalaman, keahlian teknis, atau portfolio Marzuki?",
                  },
                ])
              }
              title="Reset Percakapan"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title="Tutup Chat"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#ffffff] text-xs">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            // Hide empty assistant message placeholder so only typing animation or actual text shows
            if (!isUser && !m.content) return null;

            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    isUser
                      ? "bg-[#1a73e8] text-white rounded-br-xs"
                      : "bg-[#f1f3f4] text-[#202124] rounded-bl-xs"
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    <div className="prose prose-xs max-w-none text-[#202124] space-y-1.5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold text-black" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-4 space-y-0.5 my-1" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-4 space-y-0.5 my-1" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                          ),
                          a: ({ node, href, children, ...props }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium break-all"
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className="rounded bg-gray-200/80 px-1 py-0.5 font-mono text-[11px] text-gray-800"
                                {...props}
                              />
                            ) : (
                              <code
                                className="block overflow-x-auto rounded bg-gray-800 p-2 font-mono text-[11px] text-white my-1.5"
                                {...props}
                              />
                            ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex items-center gap-2 text-[#5f6368] pt-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-[#f1f3f4] px-3.5 py-2.5 text-xs">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Chips (Clean Icons, No Emojis) */}
        <div className="border-t border-gray-100 bg-[#f8f9fa] px-3 py-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            <button
              type="button"
              onClick={() => handleQuickPrompt("Apa tech stack utama Marzuki?")}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
            >
              <Code2 className="h-3 w-3 text-blue-600" />
              Tech Stack
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt("Ceritakan pengalaman kerja di Assist.id")}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
            >
              <Briefcase className="h-3 w-3 text-blue-600" />
              Assist.id
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt("Apa saja project terbaik Marzuki?")}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
            >
              <Layers className="h-3 w-3 text-blue-600" />
              Top Projects
            </button>
          </div>
        </div>

        {/* Input Box Footer */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-gray-200 bg-white p-2.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apa saja tentang Marzuki..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-[#1a73e8]"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}
