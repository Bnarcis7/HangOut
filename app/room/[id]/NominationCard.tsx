'use client';

import VoteButton from './VoteButton';

interface NominationCardProps {
  nomination: {
    id: string;
    title: string;
    description?: string | null;
    type: string;
    metadata?: Record<string, unknown> | null;
    user: {
      name: string | null;
    };
    votes: Array<{ userId: string }>;
  };
  currentUserId?: string;
  roomType: string;
}

export default function NominationCard({ nomination, currentUserId, roomType }: NominationCardProps) {
  const metadata = nomination.metadata as Record<string, string> | null;
  const hasUserVoted = nomination.votes.some((v) => v.userId === currentUserId);

  // Helper to create Google search URL
  const getMenuSearchUrl = () => {
    const query = `${nomination.title} menu`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  // Helper to create Google Maps URL
  const getMapsUrl = () => {
    if (metadata?.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${nomination.title} ${metadata.address}`
      )}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nomination.title)}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] sm:text-[14px] font-semibold text-gray-900 mb-1">
            {nomination.title}
          </h3>
          {nomination.description && (
            <p className="text-[12px] sm:text-[13px] text-gray-600 mb-2">
              {nomination.description}
            </p>
          )}

          {/* Restaurant-specific metadata */}
          {roomType === 'RESTAURANT' && metadata && (
            <div className="space-y-1.5 mb-3">
              {metadata.address && (
                <div className="flex items-start gap-2 text-[12px] text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{metadata.address}</span>
                </div>
              )}
              {metadata.cuisine && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{metadata.cuisine}</span>
                </div>
              )}
              {metadata.priceRange && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{metadata.priceRange}</span>
                </div>
              )}
            </div>
          )}

          {/* Home Takeout metadata */}
          {roomType === 'HOME_TAKEOUT' && metadata && (
            <div className="space-y-1.5 mb-3">
              {metadata.cuisine && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <span className="text-gray-400">🍕</span>
                  <span>{metadata.cuisine}</span>
                </div>
              )}
              {metadata.deliveryPlatform && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <span className="text-gray-400">🚚</span>
                  <span>{metadata.deliveryPlatform}</span>
                </div>
              )}
            </div>
          )}

          {/* Drinks metadata */}
          {roomType === 'HOME_DRINKS' && metadata && (
            <div className="space-y-1.5 mb-3">
              {metadata.drinkType && (
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <span className="text-gray-400">🍹</span>
                  <span>{metadata.drinkType}</span>
                </div>
              )}
              {metadata.ingredients && (
                <div className="flex items-start gap-2 text-[12px] text-gray-600">
                  <span className="text-gray-400 mt-0.5">📝</span>
                  <span>{metadata.ingredients}</span>
                </div>
              )}
            </div>
          )}

          {/* Games metadata */}
          {roomType === 'HOME_GAMES' && metadata && (
            <div className="flex items-center gap-3 mb-3 text-[12px] text-gray-600">
              {metadata.playerCount && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">👥</span>
                  <span>{metadata.playerCount} players</span>
                </div>
              )}
              {metadata.duration && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">⏱️</span>
                  <span>{metadata.duration}</span>
                </div>
              )}
            </div>
          )}

          {/* Movie metadata */}
          {roomType === 'MOVIE_NIGHT' && metadata && (
            <div className="flex items-center gap-3 mb-3 text-[12px] text-gray-600">
              {metadata.genre && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">🎭</span>
                  <span>{metadata.genre}</span>
                </div>
              )}
              {metadata.runtime && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">⏱️</span>
                  <span>{metadata.runtime}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons for Restaurants */}
          {(roomType === 'RESTAURANT' || roomType === 'HOME_TAKEOUT') && (
            <div className="flex flex-wrap gap-2 mb-3">
              <a
                href={getMenuSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] sm:text-[12px] font-medium rounded-lg transition-colors border border-gray-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Menu
              </a>
              
              {metadata?.address && (
                <a
                  href={getMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] sm:text-[12px] font-medium rounded-lg transition-colors border border-gray-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Maps
                </a>
              )}

              {metadata?.website && (
                <a
                  href={metadata.website as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] sm:text-[12px] font-medium rounded-lg transition-colors border border-gray-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
              )}

              {metadata?.phone && (
                <a
                  href={`tel:${metadata.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] sm:text-[12px] font-medium rounded-lg transition-colors border border-gray-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </a>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-gray-500">
            <span>by {nomination.user.name || 'Anonymous'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <VoteButton
            nominationId={nomination.id}
            initialVoteCount={nomination.votes.length}
            hasUserVoted={hasUserVoted}
          />
        </div>
      </div>
    </div>
  );
}
