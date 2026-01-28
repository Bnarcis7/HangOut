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
    const { roomId, title, description, type, metadata } = body

    // Validate required fields
    if (!roomId || !title || !type) {
      return NextResponse.json(
        { message: 'Missing required fields: roomId, title, type' },
        { status: 400 }
      )
    }

    // Verify user is a member of the room
    const membership = await prisma.roomMember.findFirst({
      where: {
        roomId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { message: 'You are not a member of this room' },
        { status: 403 }
      )
    }

    // Determine nomination type based on room type
    let nominationType: 'RESTAURANT' | 'MOVIE' | 'GAME' | 'DRINK' | 'CUSTOM' = 'CUSTOM'
    if (type === 'RESTAURANT' || type === 'HOME_TAKEOUT') {
      nominationType = 'RESTAURANT'
    } else if (type === 'MOVIE_NIGHT') {
      nominationType = 'MOVIE'
    } else if (type === 'HOME_GAMES') {
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
        roomId,
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

    // Update room status to VOTING if it's still in PLANNING
    await prisma.room.updateMany({
      where: {
        id: roomId,
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
