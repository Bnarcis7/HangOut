'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MovieSearch from './MovieSearch'

interface AddNominationModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  roomType: string
  nominationLabel: string
}

export default function AddNominationModal({
  isOpen,
  onClose,
  roomId,
  roomType,
  nominationLabel,
}: AddNominationModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  // Restaurant-specific fields
  const [address, setAddress] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [priceRange, setPriceRange] = useState('$$')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  
  // Home Takeout fields
  const [deliveryPlatform, setDeliveryPlatform] = useState('')
  
  // Drinks fields
  const [drinkType, setDrinkType] = useState('')
  const [ingredients, setIngredients] = useState('')
  
  // Games fields
  const [playerCount, setPlayerCount] = useState('')
  const [duration, setDuration] = useState('')
  
  // Movie fields
  const [genre, setGenre] = useState('')
  const [runtime, setRuntime] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMovieSelect = (movie: {
    title: string
    genre: string
    runtime: string
    description: string
    posterUrl: string | null
  }) => {
    setTitle(movie.title)
    setGenre(movie.genre)
    setRuntime(movie.runtime)
    setDescription(movie.description)
    setPosterUrl(movie.posterUrl || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const nominationData: Record<string, unknown> = {
        roomId,
        title,
        description,
        type: roomType,
      }

      // Add type-specific data
      if (roomType === 'RESTAURANT') {
        nominationData.metadata = {
          address,
          cuisine,
          priceRange,
          website,
          phone,
        }
      } else if (roomType === 'HOME_TAKEOUT') {
        nominationData.metadata = {
          cuisine,
          deliveryPlatform,
        }
      } else if (roomType === 'HOME_DRINKS') {
        nominationData.metadata = {
          drinkType,
          ingredients,
        }
      } else if (roomType === 'HOME_GAMES') {
        nominationData.metadata = {
          playerCount,
          duration,
        }
      } else if (roomType === 'MOVIE_NIGHT') {
        nominationData.metadata = {
          genre,
          runtime,
          posterUrl,
        }
      }

      const response = await fetch('/api/nominations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nominationData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create nomination')
        setLoading(false)
        return
      }

      // Reset form
      setTitle('')
      setDescription('')
      setAddress('')
      setCuisine('')
      setPriceRange('$$')
      setWebsite('')
      setPhone('')
      setDeliveryPlatform('')
      setDrinkType('')
      setIngredients('')
      setPlayerCount('')
      setDuration('')
      setGenre('')
      setRuntime('')
      
      onClose()
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
          <h2 className="text-[15px] sm:text-[17px] font-semibold text-gray-900">
            Add {nominationLabel.slice(0, -1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-[12px] sm:text-[13px]">
              {error}
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label htmlFor="title" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
              {roomType === 'RESTAURANT' ? 'Restaurant Name' :
               roomType === 'HOME_TAKEOUT' ? 'Restaurant Name' :
               roomType === 'HOME_DRINKS' ? 'Drink Name' :
               roomType === 'HOME_GAMES' ? 'Game Name' :
               roomType === 'MOVIE_NIGHT' ? 'Movie Title' :
               'Title'}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
              placeholder={
                roomType === 'RESTAURANT' ? 'e.g., The Italian Place' :
                roomType === 'HOME_TAKEOUT' ? 'e.g., Pizza Palace' :
                roomType === 'HOME_DRINKS' ? 'e.g., Mojito' :
                roomType === 'HOME_GAMES' ? 'e.g., Catan' :
                roomType === 'MOVIE_NIGHT' ? 'e.g., Inception' :
                'Enter a title'
              }
            />
          </div>

          {/* Restaurant-specific fields */}
          {roomType === 'RESTAURANT' && (
            <>
              <div>
                <label htmlFor="address" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="123 Main St, City"
                />
              </div>
              <div>
                <label htmlFor="cuisine" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="Italian, Chinese, Mexican, etc."
                />
              </div>
              <div>
                <label className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  {['$', '$$', '$$$', '$$$$'].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setPriceRange(price)}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-[13px] font-medium ${
                        priceRange === price
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="website" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Website <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="https://restaurant-website.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </>
          )}

          {/* Home Takeout fields */}
          {roomType === 'HOME_TAKEOUT' && (
            <>
              <div>
                <label htmlFor="cuisine" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="Pizza, Sushi, Burgers, etc."
                />
              </div>
              <div>
                <label htmlFor="deliveryPlatform" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Delivery Platform
                </label>
                <select
                  id="deliveryPlatform"
                  value={deliveryPlatform}
                  onChange={(e) => setDeliveryPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                >
                  <option value="">Select platform...</option>
                  <option value="UberEats">Uber Eats</option>
                  <option value="DoorDash">DoorDash</option>
                  <option value="GrubHub">GrubHub</option>
                  <option value="Postmates">Postmates</option>
                  <option value="Seamless">Seamless</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          {/* Drinks fields */}
          {roomType === 'HOME_DRINKS' && (
            <>
              <div>
                <label htmlFor="drinkType" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Drink Type
                </label>
                <select
                  id="drinkType"
                  value={drinkType}
                  onChange={(e) => setDrinkType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                >
                  <option value="">Select type...</option>
                  <option value="Cocktail">Cocktail</option>
                  <option value="Beer">Beer</option>
                  <option value="Wine">Wine</option>
                  <option value="Spirits">Spirits</option>
                  <option value="Non-Alcoholic">Non-Alcoholic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="ingredients" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Ingredients / Recipe
                </label>
                <textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px] resize-none"
                  placeholder="List ingredients or recipe steps..."
                />
              </div>
            </>
          )}

          {/* Games fields */}
          {roomType === 'HOME_GAMES' && (
            <>
              <div>
                <label htmlFor="playerCount" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Player Count
                </label>
                <input
                  type="text"
                  id="playerCount"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="e.g., 2-4 players"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Play Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="e.g., 60-90 minutes"
                />
              </div>
            </>
          )}

          {/* Movie fields */}
          {roomType === 'MOVIE_NIGHT' && (
            <>
              <div>
                <label htmlFor="movieSearch" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Search Movie
                </label>
                <MovieSearch onSelect={handleMovieSelect} />
                <p className="text-[11px] text-gray-500 mt-1">
                  Start typing to search for a movie
                </p>
              </div>
              <div>
                <label htmlFor="title" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="Movie title"
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="Action, Comedy, Drama, etc."
                />
              </div>
              <div>
                <label htmlFor="runtime" className="block text-[12px] sm:text-[13px] font-medium text-gray-700 mb-2">
                  Runtime
                </label>
                <input
                  type="text"
                  id="runtime"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
                  placeholder="e.g., 2h 28m"
                />
              </div>
            </>
          )}

          {/* Description (common for all types) */}
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
              placeholder="Add any additional details..."
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
              disabled={loading || !title.trim()}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-[12px] sm:text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Nomination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
