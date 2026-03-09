import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

type Coach = {
  _id: Id<"coaches">;
  name: string;
  avatar: string;
  shareCode?: string;
};

interface ShareModalProps {
  coach: Coach;
  onClose: () => void;
}

export function ShareModal({ coach, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}?import=${coach.shareCode}`;
  const shareCode = coach.shareCode || "N/A";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent" />

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

          {/* Coach info */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 text-4xl bg-zinc-800/50 rounded-2xl mb-4">
              {coach.avatar}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Share {coach.name}</h2>
            <p className="text-zinc-500 text-sm">Share this coach with others</p>
          </div>

          {/* Share code */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Share Code
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white font-mono text-lg tracking-widest text-center">
                {shareCode}
              </div>
              <button
                onClick={() => copyToClipboard(shareCode)}
                className="px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-all"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Share URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Direct Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-400 text-sm truncate"
              />
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Social share */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this AI coach I created!&url=${encodeURIComponent(shareUrl)}`, "_blank")}
              className="p-3 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
              title="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")}
              className="p-3 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Anyone with this code can import your coach
          </p>
        </div>
      </div>
    </div>
  );
}
