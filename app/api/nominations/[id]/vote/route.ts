import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: nominationId } = await params

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_nominationId: {
          userId: session.user.id,
          nominationId,
        },
      },
    })

    if (existingVote) {
      return NextResponse.json(
        { message: 'You have already voted for this nomination' },
        { status: 400 }
      )
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        nominationId,
      },
    })

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { nominationId },
    })

    return NextResponse.json({ vote, voteCount }, { status: 201 })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: nominationId } = await params

    // Delete vote
    await prisma.vote.delete({
      where: {
        userId_nominationId: {
          userId: session.user.id,
          nominationId,
        },
      },
    })

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { nominationId },
    })

    return NextResponse.json({ voteCount }, { status: 200 })
  } catch (error) {
    console.error('Unvote error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
