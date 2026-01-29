import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch movie details')
    }

    const data = await response.json()

    // Format runtime (minutes to hours and minutes)
    const formatRuntime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours}h ${mins}m`
    }

    const movie = {
      id: data.id,
      title: data.title,
      year: data.release_date ? new Date(data.release_date).getFullYear() : null,
      overview: data.overview,
      posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      backdropPath: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null,
      rating: data.vote_average,
      runtime: data.runtime ? formatRuntime(data.runtime) : null,
      runtimeMinutes: data.runtime,
      genres: data.genres.map((g: { id: number; name: string }) => g.name).join(', '),
      releaseDate: data.release_date,
    }

    return NextResponse.json({ movie })
  } catch (error) {
    console.error('TMDB movie details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    )
  }
}
