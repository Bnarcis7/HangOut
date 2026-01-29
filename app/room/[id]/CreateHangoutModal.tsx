"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateHangoutModalProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

const hangoutTypes = [
  { value: "RESTAURANT", label: "Restaurant", emoji: "🍽️" },
  { value: "HOME_TAKEOUT", label: "Home Takeout", emoji: "🏠" },
  { value: "HOME_DRINKS", label: "Drinks at Home", emoji: "🍹" },
  { value: "HOME_GAMES", label: "Game Night", emoji: "🎲" },
  { value: "MOVIE_NIGHT", label: "Movie Night", emoji: "🎬" },
  { value: "GAME_NIGHT", label: "Game Night", emoji: "🎮" },
  { value: "CUSTOM", label: "Custom", emoji: "✨" },
];

export default function CreateHangoutModal({
  roomId,
  isOpen,
  onClose,
}: CreateHangoutModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("RESTAURANT");
  const [description, setDescription] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/hangouts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          name,
          type,
          description: description || undefined,
          scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create hangout");
      }

      // Reset form
      setName("");
      setType("RESTAURANT");
      setDescription("");
      setScheduledFor("");
      
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Hangout</h2>
          <p className="text-sm text-gray-500 mt-1">
            Plan a new activity for your group
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Hangout Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Friday Night Dinner"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            >
              {hangoutTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Scheduled Date (Optional) */}
          <div>
            <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date & Time (Optional)
            </label>
            <input
              id="scheduledFor"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add any details about this hangout..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? "Creating..." : "Create Hangout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
