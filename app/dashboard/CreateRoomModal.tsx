'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [type, setType] = useState('RESTAURANT')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roomTypes = [
    { value: 'RESTAURANT', label: 'Restaurant', icon: '🍽️' },
    { value: 'HOME_TAKEOUT', label: 'Home Takeout', icon: '🏠' },
    { value: 'HOME_DRINKS', label: 'Drinks at Home', icon: '🍹' },
    { value: 'HOME_GAMES', label: 'Game Night', icon: '🎲' },
    { value: 'MOVIE_NIGHT', label: 'Movie Night', icon: '🎬' },
    { value: 'CUSTOM', label: 'Custom', icon: '✨' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create room')
        setLoading(false)
        return
      }

      // Reset form and close modal
      setName('')
      setType('RESTAURANT')
      setDescription('')
      onClose()
      
      // Refresh to show new room
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-[15px] sm:text-[17px] font-semibold text-gray-900">Create New Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-[12px] sm:text-[13px]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
              Room Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
              placeholder="Friday Night Dinner"
            />
          </div>

          <div>
            <label className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-3">
              Room Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roomTypes.map((roomType) => (
                <button
                  key={roomType.value}
                  type="button"
                  onClick={() => setType(roomType.value)}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all text-left ${
                    type === roomType.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">{roomType.icon}</span>
                    <span className="text-[12px] sm:text-[13px] font-medium text-gray-900">
                      {roomType.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px] resize-none"
              placeholder="Add any details about this hangout..."
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[12px] sm:text-[13px] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-[12px] sm:text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
