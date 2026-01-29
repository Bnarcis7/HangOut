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
    const { name, description, memberEmails = [] } = body

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Room name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Generate unique invite code
    const inviteCode = nanoid(10)

    // Find or create users for invited emails
    const memberUsers = []
    for (const email of memberEmails) {
      const emailLower = email.toLowerCase().trim()
      
      // Skip if it's the creator's email
      if (emailLower === session.user.email?.toLowerCase()) {
        continue
      }
      
      // Find existing user or skip (we'll send invite later)
      const existingUser = await prisma.user.findUnique({
        where: { email: emailLower },
      })
      
      if (existingUser) {
        memberUsers.push(existingUser.id)
      }
      // TODO: Send email invitation to non-existing users
    }

    // Create room and add creator + invited members
    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        inviteCode,
        creatorId: session.user.id,
        members: {
          create: [
            {
              userId: session.user.id,
              role: 'CREATOR',
            },
            ...memberUsers.map((userId) => ({
              userId,
              role: 'PARTICIPANT' as const,
            })),
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
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
