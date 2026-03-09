import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
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
  isPublic: boolean;
};

interface CreateCoachModalProps {
  onClose: () => void;
  editCoach?: Coach | null;
}

const avatarOptions = ["🧠", "🎯", "💪", "🌟", "🔥", "💎", "🦊", "🦁", "🐺", "🦅", "🌊", "⚡", "🌙", "☀️", "🎨", "📚"];
const toneOptions = ["Supportive", "Direct", "Analytical", "Motivational", "Calm"];
const specialtyOptions = ["Life Coaching", "Career", "Fitness", "Mindfulness", "Productivity", "Relationships", "Finance", "Creativity"];

export function CreateCoachModal({ onClose, editCoach }: CreateCoachModalProps) {
  const createCoach = useMutation(api.coaches.create);
  const updateCoach = useMutation(api.coaches.update);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    persona: "",
    description: "",
    avatar: "🧠",
    systemPrompt: "",
    tone: "Supportive",
    specialty: "Life Coaching",
    isPublic: false,
  });

  useEffect(() => {
    if (editCoach) {
      setFormData({
        name: editCoach.name,
        persona: editCoach.persona,
        description: editCoach.description,
        avatar: editCoach.avatar,
        systemPrompt: editCoach.systemPrompt,
        tone: editCoach.tone,
        specialty: editCoach.specialty,
        isPublic: editCoach.isPublic,
      });
    }
  }, [editCoach]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editCoach) {
        await updateCoach({ id: editCoach._id, ...formData });
      } else {
        await createCoach(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save coach:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {editCoach ? "Edit Coach" : "Create New Coach"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: emoji })}
                  className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${
                    formData.avatar === emoji
                      ? "bg-amber-500/20 border-2 border-amber-500 scale-110"
                      : "bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name and Persona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                placeholder="Coach Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Persona Title</label>
              <input
                type="text"
                required
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                placeholder="Productivity Master"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
              placeholder="A brief description of what this coach helps with..."
            />
          </div>

          {/* Tone and Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Coaching Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
              >
                {toneOptions.map((tone) => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Specialty</label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
              >
                {specialtyOptions.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Personality & Instructions
            </label>
            <p className="text-xs text-zinc-500 mb-2">Define how this coach should behave, their background, and coaching style.</p>
            <textarea
              required
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none font-mono text-sm"
              placeholder="You are a high-energy productivity coach who believes in the power of small, consistent actions. You help people overcome procrastination by breaking down overwhelming tasks into manageable steps..."
            />
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
            <div>
              <p className="text-white font-medium">Make Public</p>
              <p className="text-sm text-zinc-500">Allow others to discover and use this coach</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.isPublic ? "bg-amber-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  formData.isPublic ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : editCoach ? "Update Coach" : "Create Coach"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
