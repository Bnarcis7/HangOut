'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useDebounce } from '@/hooks/useDebounce'

interface Movie {
  id: number
  title: string
  year: number | null
  overview: string
  posterPath: string | null
  rating: number
}

interface MovieSearchProps {
  onSelect: (movie: {
    title: string
    genre: string
    runtime: string
    description: string
    posterUrl: string | null
  }) => void
}

export default function MovieSearch({ onSelect }: MovieSearchProps) {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search movies when query changes
  useEffect(() => {
    const searchMovies = async () => {
      if (debouncedQuery.trim().length < 2) {
        setMovies([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(debouncedQuery)}`
        )
        const data = await response.json()
        
        if (response.ok) {
          setMovies(data.movies || [])
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    searchMovies()
  }, [debouncedQuery])

  const handleSelectMovie = async (movie: Movie) => {
    setSelectedMovie(movie)
    setQuery(movie.title)
    setShowResults(false)

    // Fetch full movie details
    try {
      const response = await fetch(`/api/movies/${movie.id}`)
      const data = await response.json()

      if (response.ok) {
        onSelect({
          title: data.movie.title,
          genre: data.movie.genres,
          runtime: data.movie.runtime || '',
          description: data.movie.overview,
          posterUrl: data.movie.posterPath,
        })
      }
    } catch (error) {
      console.error('Error fetching movie details:', error)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedMovie(null)
          }}
          onFocus={() => {
            if (movies.length > 0) setShowResults(true)
          }}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition text-[13px] sm:text-[14px]"
          placeholder="Search for a movie..."
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        )}
        {selectedMovie && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {showResults && movies.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className="w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left flex items-start gap-3 border-b border-gray-100 last:border-b-0"
            >
              {movie.posterPath ? (
                <Image
                  src={movie.posterPath}
                  alt={movie.title}
                  width={48}
                  height={72}
                  className="w-12 h-18 object-cover rounded flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-18 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-[13px] truncate">
                  {movie.title}
                  {movie.year && <span className="text-gray-500 ml-1">({movie.year})</span>}
                </div>
                <div className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                  {movie.overview || 'No description available'}
                </div>
                {movie.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[11px] text-gray-600">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && debouncedQuery.length >= 2 && movies.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-[13px]">
          No movies found
        </div>
      )}
    </div>
  )
}
