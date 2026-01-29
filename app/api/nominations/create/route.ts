import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { hangoutId, title, description, type, metadata } = body

    // Validate required fields
    if (!hangoutId || !title || !type) {
      return NextResponse.json(
        { message: 'Missing required fields: hangoutId, title, type' },
        { status: 400 }
      )
    }

    // Verify hangout exists and user has access to it
    const hangout = await prisma.hangout.findUnique({
      where: { id: hangoutId },
      include: {
        room: {
          include: {
            members: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
    })

    if (!hangout) {
      return NextResponse.json(
        { message: 'Hangout not found' },
        { status: 404 }
      )
    }

    if (hangout.room.members.length === 0) {
      return NextResponse.json(
        { message: 'You are not a member of this room' },
        { status: 403 }
      )
    }

    // Determine nomination type based on hangout type
    let nominationType: 'RESTAURANT' | 'MOVIE' | 'GAME' | 'DRINK' | 'CUSTOM' = 'CUSTOM'
    if (type === 'RESTAURANT' || type === 'HOME_TAKEOUT') {
      nominationType = 'RESTAURANT'
    } else if (type === 'MOVIE_NIGHT') {
      nominationType = 'MOVIE'
    } else if (type === 'HOME_GAMES' || type === 'GAME_NIGHT') {
      nominationType = 'GAME'
    } else if (type === 'HOME_DRINKS') {
      nominationType = 'DRINK'
    }

    // Create nomination
    const nomination = await prisma.nomination.create({
      data: {
        title,
        description: description || null,
        type: nominationType,
        metadata: metadata || {},
        userId: session.user.id,
        hangoutId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        votes: true,
      },
    })

    // Update hangout status to VOTING if it's still in PLANNING
    await prisma.hangout.updateMany({
      where: {
        id: hangoutId,
        status: 'PLANNING',
      },
      data: {
        status: 'VOTING',
      },
    })

    return NextResponse.json(nomination, { status: 201 })
  } catch (error) {
    console.error('Create nomination error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
