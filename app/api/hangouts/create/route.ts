import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, type, description, roomId, scheduledFor } = body

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Hangout name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { message: 'Hangout type is required' },
        { status: 400 }
      )
    }

    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID is required' },
        { status: 400 }
      )
    }

    // Verify user is a member of the room
    const membership = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId,
        },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { message: 'You are not a member of this room' },
        { status: 403 }
      )
    }

    // Create hangout
    const hangout = await prisma.hangout.create({
      data: {
        name: name.trim(),
        type,
        description: description?.trim() || null,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        creatorId: session.user.id,
        roomId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      { 
        message: 'Hangout created successfully',
        hangout,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Hangout creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create hangout' },
      { status: 500 }
    )
  }
}
