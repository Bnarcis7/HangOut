'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface VoteButtonProps {
  nominationId: string
  initialVoteCount: number
  hasUserVoted: boolean
}

export default function VoteButton({
  nominationId,
  initialVoteCount,
  hasUserVoted,
}: VoteButtonProps) {
  const router = useRouter()
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [hasVoted, setHasVoted] = useState(hasUserVoted)
  const [loading, setLoading] = useState(false)

  const handleVote = async () => {
    if (loading) return

    setLoading(true)

    try {
      if (hasVoted) {
        // Remove vote
        const response = await fetch(`/api/nominations/${nominationId}/vote`, {
          method: 'DELETE',
        })

        if (response.ok) {
          const data = await response.json()
          setVoteCount(data.voteCount)
          setHasVoted(false)
        }
      } else {
        // Add vote
        const response = await fetch(`/api/nominations/${nominationId}/vote`, {
          method: 'POST',
        })

        if (response.ok) {
          const data = await response.json()
          setVoteCount(data.voteCount)
          setHasVoted(true)
        }
      }

      router.refresh()
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded-lg transition-colors flex items-center gap-1 sm:gap-1.5 ${
        hasVoted
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-300 hover:bg-gray-50'
      } disabled:opacity-50`}
    >
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
        fill={hasVoted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
      <span className="text-[12px] sm:text-[13px] font-medium">{voteCount}</span>
    </button>
  )
}
