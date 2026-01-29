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
  const [description, setDescription] = useState('')
  const [memberEmails, setMemberEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddEmail = () => {
    const email = emailInput.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!email) return
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (memberEmails.includes(email)) {
      setError('This email is already added')
      return
    }
    
    setMemberEmails([...memberEmails, email])
    setEmailInput('')
    setError('')
  }

  const handleRemoveEmail = (email: string) => {
    setMemberEmails(memberEmails.filter(e => e !== email))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

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
        body: JSON.stringify({ 
          name, 
          description,
          memberEmails 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create room')
        setLoading(false)
        return
      }

      // Reset form and close modal
      setName('')
      setDescription('')
      setMemberEmails([])
      setEmailInput('')
      onClose()
      
      // Redirect to the new room
      router.push(`/room/${data.room.id}`)
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
              Room Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
              placeholder="Friday Night Crew"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Create a group for your friends to plan hangouts together
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px] resize-none"
              placeholder="Weekly hangouts with the crew..."
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
              Invite Members (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                placeholder="friend@example.com"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-[12px] sm:text-[13px] font-medium"
              >
                Add
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Press Enter or click Add to invite members by email
            </p>
            
            {memberEmails.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] font-medium text-gray-700">
                  Invited Members ({memberEmails.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {memberEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 rounded-lg text-[12px] text-gray-700"
                    >
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
