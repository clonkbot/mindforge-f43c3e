import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

interface ImportCoachModalProps {
  onClose: () => void;
}

export function ImportCoachModal({ onClose }: ImportCoachModalProps) {
  const [shareCode, setShareCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cloneCoach = useMutation(api.coaches.cloneCoach);
  const previewCoach = useQuery(
    api.coaches.getByShareCode,
    shareCode.length === 8 ? { shareCode } : "skip"
  );

  // Check URL for import param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const importCode = params.get("import");
    if (importCode) {
      setShareCode(importCode);
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleImport = async () => {
    if (!shareCode.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      await cloneCoach({ shareCode: shareCode.trim() });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Coach not found. Please check the share code.");
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

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />

        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Import Coach</h2>
            <p className="text-zinc-500 text-sm">Enter a share code to import someone's coach</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Coach Imported!</h3>
              <p className="text-zinc-500 text-sm">The coach has been added to your collection</p>
            </div>
          ) : (
            <>
              {/* Share code input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Share Code
                </label>
                <input
                  type="text"
                  value={shareCode}
                  onChange={(e) => {
                    setShareCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                    setError("");
                  }}
                  maxLength={8}
                  className="w-full px-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white font-mono text-xl tracking-widest text-center placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all uppercase"
                  placeholder="XXXXXXXX"
                />
              </div>

              {/* Preview */}
              {previewCoach && (
                <div className="mb-6 p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{previewCoach.avatar}</span>
                    <div>
                      <p className="text-white font-semibold">{previewCoach.name}</p>
                      <p className="text-sm text-zinc-500">{previewCoach.persona}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mt-3">{previewCoach.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-lg bg-zinc-700/50 text-zinc-400">
                      {previewCoach.tone}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-lg bg-zinc-700/50 text-zinc-400">
                      {previewCoach.specialty}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <p className="mb-4 text-rose-400 text-sm bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={isLoading || shareCode.length < 8 || !previewCoach}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Importing..." : "Import Coach"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
