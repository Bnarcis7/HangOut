import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import CreateHangoutButton from "./CreateHangoutButton";

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { id: roomId } = await params;

  // Get room with all related data
  const roomMember = await prisma.roomMember.findFirst({
    where: {
      roomId,
      userId: session.user.id,
    },
    include: {
      room: {
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
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
          hangouts: {
            include: {
              creator: {
                select: {
                  id: true,
                  name: true,
                },
              },
              _count: {
                select: {
                  nominations: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!roomMember) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { room } = roomMember as any;

  const hangoutTypeConfigs = {
    RESTAURANT: { emoji: "🍽️", label: "Restaurant" },
    HOME_TAKEOUT: { emoji: "🏠", label: "Home Takeout" },
    HOME_DRINKS: { emoji: "🍹", label: "Drinks at Home" },
    HOME_GAMES: { emoji: "🎲", label: "Game Night" },
    MOVIE_NIGHT: { emoji: "🎬", label: "Movie Night" },
    GAME_NIGHT: { emoji: "🎮", label: "Game Night" },
    CUSTOM: { emoji: "✨", label: "Custom" },
  };

  const hangoutStatusStyles = {
    PLANNING: "bg-blue-50 text-blue-700 border-blue-200",
    VOTING: "bg-purple-50 text-purple-700 border-purple-200",
    DECIDED: "bg-green-50 text-green-700 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
    ARCHIVED: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Image 
                  src="/logo.png" 
                  alt="HangOut Logo" 
                  width={24}
                  height={24}
                  className="object-contain hidden sm:block flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h1 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight truncate">
                    {room.name}
                  </h1>
                  <p className="text-[11px] sm:text-[13px] text-gray-500 mt-0.5 hidden sm:block">
                    👥 {room.members.length} members · {room.hangouts.length} hangouts
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button className="px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <span className="hidden md:inline">Invite Members</span>
                <span className="md:hidden">Invite</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Area - Hangouts */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Room Description */}
            {room.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                <p className="text-[13px] sm:text-[14px] text-gray-700">{room.description}</p>
              </div>
            )}

            {/* Hangouts Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
                    Hangouts
                  </h2>
                  <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5 hidden sm:block">
                    Create and plan activities with your group
                  </p>
                </div>
                <CreateHangoutButton
                  roomId={room.id}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  <span className="hidden sm:inline">Create Hangout</span>
                  <span className="sm:hidden">Create</span>
                </CreateHangoutButton>
              </div>

              <div className="p-4 sm:p-6">
                {room.hangouts.length === 0 ? (
                  <div className="text-center py-10 sm:py-12">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mb-1">
                      No hangouts yet
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-gray-500 mb-5 sm:mb-6 px-4">
                      Create your first hangout to start planning activities
                    </p>
                    <CreateHangoutButton
                      roomId={room.id}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Create First Hangout
                    </CreateHangoutButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {room.hangouts.map((hangout: any) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const typeConfig = (hangoutTypeConfigs as any)[hangout.type] || hangoutTypeConfigs.CUSTOM;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const statusStyle = (hangoutStatusStyles as any)[hangout.status] || hangoutStatusStyles.PLANNING;

                      return (
                        <Link
                          key={hangout.id}
                          href={`/hangout/${hangout.id}`}
                          className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">{typeConfig.emoji}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-gray-900 truncate">
                                    {hangout.name}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusStyle} flex-shrink-0`}>
                                    {hangout.status.charAt(0) + hangout.status.slice(1).toLowerCase()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-[12px] text-gray-500">
                                  <span>{typeConfig.label}</span>
                                  <span>{hangout._count?.nominations || 0} nominations</span>
                                  {hangout.scheduledFor && (
                                    <span className="hidden sm:inline">
                                      {new Date(hangout.scheduledFor).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Members & Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Members */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
                  Members ({room.members.length})
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {room.members.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-gray-600">
                        {member.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-medium text-gray-900 truncate">
                        {member.user.name}
                      </p>
                      <p className="text-[11px] sm:text-[12px] text-gray-500 truncate">
                        {member.user.email}
                      </p>
                    </div>
                    {member.role === "CREATOR" && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide flex-shrink-0">
                        Owner
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Code */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-[12px] sm:text-[13px] font-semibold text-gray-900 mb-3">
                Invite Code
              </h3>
              <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200">
                <code className="text-[12px] sm:text-[14px] font-mono text-gray-900 break-all">
                  {room.inviteCode}
                </code>
              </div>
              <button className="mt-3 w-full px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
