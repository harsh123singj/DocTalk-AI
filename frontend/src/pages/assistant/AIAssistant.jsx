import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  LoaderCircle,
  FileText,
  User,
  Sparkles,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AIAssistant = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const documentId = searchParams.get("documentId");

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");

  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // ==========================================
  // LOAD CHAT HISTORY
  // ==========================================

  useEffect(() => {
    if (!documentId) {
      setLoadingHistory(false);
      return;
    }

    fetchChatHistory();
  }, [documentId]);

  const fetchChatHistory = async () => {
    try {
      setLoadingHistory(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/docs/${documentId}/chat-history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load chat history"
        );
      }

      setMessages(data.data || []);
    } catch (error) {
      console.error("CHAT HISTORY ERROR:", error);

      setError(
        error.message || "Failed to load chat history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async () => {
    if (
      !prompt.trim() ||
      sending ||
      !documentId
    ) {
      return;
    }

    const currentPrompt = prompt.trim();

    // Clear input immediately
    setPrompt("");

    setError("");

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentPrompt,
      },
    ]);

    try {
      setSending(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/docs/${documentId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: currentPrompt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate answer"
        );
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.data?.answer ||
            "No answer generated.",
          sources: data.data?.sources || [],
        },
      ]);
    } catch (error) {
      console.error("CHAT ERROR:", error);

      setError(
        error.message || "Failed to generate answer"
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // NO DOCUMENT SELECTED
  // ==========================================

  if (!documentId) {
    return (
      <div className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">

          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400">
            <FileText size={26} />
          </div>

          <h2 className="mt-5 text-lg font-medium">
            No document selected
          </h2>

          <p className="mt-2 text-sm text-white/35 max-w-sm">
            Select a document from your workspace
            to start chatting with it.
          </p>

          <button
            onClick={() => navigate("/workspaces")}
            className="mt-5 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] text-sm font-medium transition-colors"
          >
            Go to Workspaces
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="flex flex-col h-full bg-[#0b0e13] text-white">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-white/10">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles size={20} />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold">
              AI Assistant
            </h1>

            <p className="text-xs text-white/35 mt-1">
              Ask questions about your document
            </p>
          </div>

        </div>

      </div>

      {/* ======================================
          ERROR
      ======================================= */}

      {error && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-sm text-red-400">

          <AlertCircle size={16} />

          <span>{error}</span>

        </div>
      )}

      {/* ======================================
          CHAT AREA
      ======================================= */}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="max-w-4xl mx-auto space-y-6">

          {/* LOADING HISTORY */}

          {loadingHistory ? (

            <div className="flex items-center justify-center py-20 text-sm text-white/40">

              <LoaderCircle
                size={20}
                className="animate-spin mr-3"
              />

              Loading conversation...

            </div>

          ) : messages.length === 0 ? (

            /* EMPTY CHAT */

            <div className="flex flex-col items-center justify-center py-20 text-center">

              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400">
                <Bot size={26} />
              </div>

              <h2 className="mt-5 text-lg font-medium">
                Ask your document anything
              </h2>

              <p className="mt-2 max-w-md text-sm text-white/35">
                Ask questions about the content of
                your uploaded document. The AI will
                answer using the document's relevant
                information.
              </p>

            </div>

          ) : (

            /* CHAT MESSAGES */

            messages.map((message, index) => (

              <div
                key={message._id || index}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {/* AI ICON */}

                {message.role !== "user" && (
                  <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-purple-500/10 text-purple-400">
                    <Bot size={18} />
                  </div>
                )}

                {/* MESSAGE */}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-[#7C3AED] text-white"
                      : "border border-white/10 bg-white/[0.03] text-white/80"
                  }`}
                >

                  {/* MESSAGE HEADER */}

                  <div className="flex items-center gap-2 mb-1.5">

                    {message.role === "user" ? (
                      <User size={13} />
                    ) : (
                      <Sparkles size={13} />
                    )}

                    <span className="text-xs opacity-60">
                      {message.role === "user"
                        ? "You"
                        : "AI Assistant"}
                    </span>

                  </div>

                  {/* MESSAGE CONTENT */}

                  <p className="text-sm leading-6 whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* SOURCES */}

                  {message.role !== "user" &&
                    message.sources?.length > 0 && (

                      <div className="mt-4 pt-3 border-t border-white/10">

                        <p className="text-xs text-white/40 mb-2">
                          Sources
                        </p>

                        <div className="space-y-2">

                          {message.sources.map(
                            (source, sourceIndex) => (

                              <div
                                key={sourceIndex}
                                className="flex gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                              >

                                <FileText
                                  size={14}
                                  className="shrink-0 mt-0.5 text-purple-400"
                                />

                                <p className="text-xs text-white/45 line-clamp-3">
                                  {source.content}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                </div>

              </div>

            ))

          )}

          {/* ==================================
              THINKING
          =================================== */}

          {sending && (

            <div className="flex items-start gap-3">

              <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-purple-500/10 text-purple-400">
                <Bot size={18} />
              </div>

              <div className="px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03]">

                <div className="flex items-center gap-2 text-sm text-white/40">

                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />

                  Thinking...

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

      </div>

      {/* ======================================
          INPUT AREA
      ======================================= */}

      <div className="border-t border-white/10 bg-[#0b0e13] px-4 sm:px-6 lg:px-8 py-4">

        <div className="max-w-4xl mx-auto">

          <div className="flex items-end gap-3 p-2 rounded-2xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/40 transition-colors">

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your document..."
              rows={1}
              disabled={sending}
              className="flex-1 min-h-10 max-h-32 resize-none bg-transparent px-2 py-2 outline-none text-sm text-white placeholder:text-white/30 disabled:opacity-50"
            />

            <button
              onClick={sendMessage}
              disabled={
                !prompt.trim() || sending
              }
              className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >

              {sending ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Send size={18} />
              )}

            </button>

          </div>

          <p className="mt-2 text-center text-[11px] text-white/20">
            AI answers are generated from your document.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AIAssistant;