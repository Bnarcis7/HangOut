import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { nanoid } from 'nanoid'

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
    const { name, type, description } = body

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Room name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { message: 'Room type is required' },
        { status: 400 }
      )
    }

    // Generate unique invite code
    const inviteCode = nanoid(10)

    // Create room and add creator as member
    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        type,
        description: description?.trim() || null,
        inviteCode,
        creatorId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'CREATOR',
          },
        },
      },
      include: {
        members: true,
      },
    })

    return NextResponse.json(
      { 
        message: 'Room created successfully',
        room,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Room creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create room' },
      { status: 500 }
    )
  }
}
