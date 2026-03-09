import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Coach = {
  _id: Id<"coaches">;
  name: string;
  persona: string;
  description: string;
  avatar: string;
  tone: string;
  specialty: string;
  isPublic: boolean;
  usageCount: number;
  creatorId: Id<"users">;
};

interface CoachCardProps {
  coach: Coach;
  onStartChat: () => void;
  onShare: () => void;
  onEdit: () => void;
}

const toneColors: Record<string, string> = {
  "Supportive": "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  "Direct": "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
  "Analytical": "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  "Motivational": "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  "Calm": "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
};

export function CoachCard({ coach, onStartChat, onShare, onEdit }: CoachCardProps) {
  const removeCoach = useMutation(api.coaches.remove);

  const toneStyle = toneColors[coach.tone] || toneColors["Supportive"];

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${coach.name}"?`)) {
      await removeCoach({ id: coach._id });
    }
  };

  return (
    <div className="group relative bg-zinc-900/60 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-300">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl w-14 h-14 flex items-center justify-center bg-zinc-800/50 rounded-xl">
            {coach.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{coach.name}</h3>
            <p className="text-sm text-zinc-500 truncate">{coach.persona}</p>
          </div>

          {/* Menu button */}
          <div className="relative">
            <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{coach.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-lg bg-gradient-to-r border ${toneStyle}`}>
            {coach.tone}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
            {coach.specialty}
          </span>
          {coach.isPublic && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Public
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {coach.usageCount} chats
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onStartChat}
            className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
          >
            Start Chat
          </button>
          <button
            onClick={onShare}
            className="p-2.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-zinc-300 transition-all"
            title="Share coach"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={onEdit}
            className="p-2.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-zinc-300 transition-all"
            title="Edit coach"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all"
            title="Delete coach"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
