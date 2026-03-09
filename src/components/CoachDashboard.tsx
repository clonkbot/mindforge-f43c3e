import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { CoachCard } from "./CoachCard";
import { CreateCoachModal } from "./CreateCoachModal";
import { ChatView } from "./ChatView";
import { ShareModal } from "./ShareModal";
import { ImportCoachModal } from "./ImportCoachModal";
import { Id } from "../../convex/_generated/dataModel";

type Coach = {
  _id: Id<"coaches">;
  name: string;
  persona: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  tone: string;
  specialty: string;
  creatorId: Id<"users">;
  isPublic: boolean;
  shareCode?: string;
  usageCount: number;
  createdAt: number;
};

export function CoachDashboard() {
  const { signOut } = useAuthActions();
  const coaches = useQuery(api.coaches.list);
  const conversations = useQuery(api.conversations.list);
  const createConversation = useMutation(api.conversations.create);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Id<"conversations"> | null>(null);
  const [shareCoach, setShareCoach] = useState<Coach | null>(null);
  const [editCoach, setEditCoach] = useState<Coach | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const startChat = async (coachId: Id<"coaches">) => {
    const conversationId = await createConversation({ coachId });
    setActiveConversation(conversationId);
    setShowMobileMenu(false);
  };

  if (activeConversation) {
    return (
      <ChatView
        conversationId={activeConversation}
        onBack={() => setActiveConversation(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-white">
                Mind<span className="text-amber-400">Forge</span>
              </h1>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Coach
              </button>
              <button
                onClick={() => signOut()}
                className="p-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-2 space-y-2 animate-in slide-in-from-top duration-200">
              <button
                onClick={() => { setShowImportModal(true); setShowMobileMenu(false); }}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 font-medium rounded-xl flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Coach
              </button>
              <button
                onClick={() => { setShowCreateModal(true); setShowMobileMenu(false); }}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Coach
              </button>
              <button
                onClick={() => signOut()}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 text-rose-400 font-medium rounded-xl flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Recent Conversations */}
        {conversations && conversations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Recent Conversations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conversations.slice(0, 6).map((conv: { _id: Id<"conversations">; title: string; lastMessageAt: number; coach?: { avatar?: string; name?: string } | null }) => (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv._id)}
                  className="group p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-left hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{conv.coach?.avatar || "🤖"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{conv.coach?.name || "Unknown Coach"}</p>
                      <p className="text-xs text-zinc-500">{new Date(conv.lastMessageAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{conv.title}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Coaches Grid */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Your Coaches
          </h2>

          {coaches === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : coaches.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No coaches yet</h3>
              <p className="text-zinc-500 mb-6 max-w-md mx-auto">Create your first AI coach with a unique personality and expertise to start your coaching journey.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Coach
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach: Coach) => (
                <CoachCard
                  key={coach._id}
                  coach={coach}
                  onStartChat={() => startChat(coach._id)}
                  onShare={() => setShareCoach(coach)}
                  onEdit={() => { setEditCoach(coach); setShowCreateModal(true); }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 mt-12 border-t border-zinc-800/50">
        <p className="text-center text-zinc-600 text-xs">
          Requested by <span className="text-zinc-500">@web-user</span> · Built by <span className="text-zinc-500">@clonkbot</span>
        </p>
      </footer>

      {/* Modals */}
      {showCreateModal && (
        <CreateCoachModal
          onClose={() => { setShowCreateModal(false); setEditCoach(null); }}
          editCoach={editCoach}
        />
      )}

      {shareCoach && (
        <ShareModal
          coach={shareCoach}
          onClose={() => setShareCoach(null)}
        />
      )}

      {showImportModal && (
        <ImportCoachModal onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
}
