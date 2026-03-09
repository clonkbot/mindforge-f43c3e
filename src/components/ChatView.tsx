import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface ChatViewProps {
  conversationId: Id<"conversations">;
  onBack: () => void;
}

const coachResponses: Record<string, string[]> = {
  "Supportive": [
    "I hear you, and I want you to know that what you're feeling is completely valid. Let's work through this together.",
    "That's a great insight! You're making real progress here. What do you think is the next small step you could take?",
    "Remember, growth isn't always linear. Every setback is an opportunity to learn something new about yourself.",
    "I believe in your ability to overcome this. You've already shown so much strength by reaching out and reflecting on this.",
  ],
  "Direct": [
    "Let's cut to the chase - what's the ONE thing standing between you and your goal right now?",
    "Excuses won't get you there. What action can you commit to TODAY?",
    "Here's the truth: you already know what you need to do. The question is, will you do it?",
    "Stop overthinking. Pick one thing, do it, then come back and tell me how it went.",
  ],
  "Analytical": [
    "Interesting. Let's break this down systematically. What are the key variables at play here?",
    "Based on what you've shared, I see three potential patterns emerging. Let me walk you through them.",
    "Data point noted. How does this compare to your baseline expectations?",
    "Let's map out the cause-and-effect chain here. What triggered this situation initially?",
  ],
  "Motivational": [
    "You've got this! I can already see the fire in your words. Channel that energy into ACTION!",
    "Every champion was once a contender who refused to give up. Today is YOUR day!",
    "Imagine yourself one year from now, looking back at this moment. Make that future self PROUD!",
    "The only limit is the one you set for yourself. It's time to break through!",
  ],
  "Calm": [
    "Take a deep breath with me. Let's approach this with clarity and presence.",
    "In the stillness of this moment, what does your intuition tell you?",
    "There's no rush. Let's sit with this feeling and understand what it's trying to teach us.",
    "Sometimes the most powerful action is thoughtful pause. What emerges when you give yourself space?",
  ],
};

export function ChatView({ conversationId, onBack }: ChatViewProps) {
  const conversation = useQuery(api.conversations.get, { id: conversationId });
  const messages = useQuery(api.messages.list, { conversationId });
  const sendMessage = useMutation(api.messages.send);
  const addAssistantMessage = useMutation(api.messages.addAssistantMessage);
  const incrementUsage = useMutation(api.coaches.incrementUsage);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversation?.coach) return;

    const userMessage = input.trim();
    setInput("");

    await sendMessage({ conversationId, content: userMessage });

    // Simulate AI response
    setIsTyping(true);

    setTimeout(async () => {
      const tone = conversation.coach?.tone || "Supportive";
      const responses = coachResponses[tone] || coachResponses["Supportive"];
      const response = responses[Math.floor(Math.random() * responses.length)];

      await addAssistantMessage({ conversationId, content: response });
      await incrementUsage({ id: conversation.coachId });
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  if (!conversation) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading conversation...</div>
      </div>
    );
  }

  const coach = conversation.coach;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{coach?.avatar || "🤖"}</span>
            <div>
              <h1 className="text-white font-semibold">{coach?.name || "Coach"}</h1>
              <p className="text-xs text-zinc-500">{coach?.persona}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              {coach?.tone}
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Welcome message */}
          {messages?.length === 0 && (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block">{coach?.avatar}</span>
              <h2 className="text-xl font-semibold text-white mb-2">
                Start your session with {coach?.name}
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto text-sm">
                {coach?.description}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["What should I focus on today?", "I'm feeling stuck", "Help me set a goal"].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages?.map((message: { _id: string; role: "user" | "assistant"; content: string; createdAt: number }) => (
            <div
              key={message._id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl rounded-br-md"
                    : "bg-zinc-800/60 text-zinc-100 rounded-2xl rounded-bl-md border border-zinc-700/30"
                } px-4 py-3`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-700/30">
                    <span className="text-lg">{coach?.avatar}</span>
                    <span className="text-xs font-medium text-zinc-400">{coach?.name}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === "user" ? "text-amber-200/60" : "text-zinc-500"}`}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/60 rounded-2xl rounded-bl-md border border-zinc-700/30 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{coach?.avatar}</span>
                  <span className="text-xs font-medium text-zinc-400">{coach?.name}</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pt-6">
        <div className="max-w-3xl mx-auto px-4 pb-6">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-5 py-4 pr-14 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-zinc-600 text-xs mt-4">
            Requested by <span className="text-zinc-500">@web-user</span> · Built by <span className="text-zinc-500">@clonkbot</span>
          </p>
        </div>
      </div>
    </div>
  );
}
