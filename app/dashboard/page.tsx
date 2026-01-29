import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import CreateRoomButton from "./CreateRoomButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get user's rooms
  const userRooms = await prisma.roomMember.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      room: {
        include: {
          _count: {
            select: {
              members: true,
              hangouts: true,
            },
          },
          hangouts: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      room: {
        createdAt: "desc",
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Image 
                src="/logo.png" 
                alt="HangOut Logo" 
                width={28}
                height={28}
                className="object-contain flex-shrink-0"
              />
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight truncate">
                  HangOut
                </h1>
                <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                <span className="text-[12px] sm:text-[13px] text-gray-500 truncate hidden sm:inline">
                  {session.user.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity overflow-hidden"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-[12px] sm:text-[13px] font-medium">
                      {session.user.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </Link>
              <CreateRoomButton className="px-3 sm:px-4 py-2 bg-gray-900 text-white text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors">
                <span className="hidden sm:inline">New Room</span>
                <span className="sm:hidden">New</span>
              </CreateRoomButton>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-[24px] sm:text-[28px] font-semibold text-gray-900 tracking-tight mb-1">
            Your Rooms
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500">
            Manage and coordinate your hangouts
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-[12px] sm:text-[13px] font-medium text-gray-500 mb-1">Total Rooms</p>
            <p className="text-[28px] sm:text-[32px] font-semibold text-gray-900 tracking-tight">
              {userRooms.length}
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-[12px] sm:text-[13px] font-medium text-gray-500 mb-1">Total Members</p>
            <p className="text-[28px] sm:text-[32px] font-semibold text-gray-900 tracking-tight">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                userRooms.reduce((acc: number, rm: any) => acc + rm.room._count.members, 0)
              }
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-[12px] sm:text-[13px] font-medium text-gray-500 mb-1">Total Hangouts</p>
            <p className="text-[28px] sm:text-[32px] font-semibold text-gray-900 tracking-tight">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                userRooms.reduce((acc: number, rm: any) => acc + (rm.room._count?.hangouts || 0), 0)
              }
            </p>
          </div>
        </div>

        {/* Rooms List */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
              All Rooms
            </h3>
          </div>

          {userRooms.length === 0 ? (
            <div className="px-4 sm:px-6 py-16 sm:py-20 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mb-1">
                No rooms yet
              </h3>
              <p className="text-[13px] sm:text-[14px] text-gray-500 mb-5 sm:mb-6 max-w-sm mx-auto px-4">
                Create your first room to start coordinating hangouts with friends
              </p>
              <CreateRoomButton className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Create Your First Room
              </CreateRoomButton>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {userRooms.map((roomMember: any) => {
                const { room } = roomMember;
                const latestHangout = room.hangouts?.[0];

                return (
                  <Link
                    href={`/room/${room.id}`}
                    key={room.id}
                    className="px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors cursor-pointer group block"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                          <span className="text-base sm:text-lg">�</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-1.5 flex-wrap">
                            <h4 className="font-semibold text-gray-900 text-[13px] sm:text-[14px] truncate">
                              {room.name}
                            </h4>
                            {roomMember.role === "CREATOR" && (
                              <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] sm:text-[11px] font-medium uppercase tracking-wide flex-shrink-0">
                                Owner
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px] text-gray-500">
                            <span className="flex items-center gap-1 sm:gap-1.5">
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              <span className="hidden xs:inline">{room._count.members} members</span>
                              <span className="xs:hidden">{room._count.members}m</span>
                            </span>
                            <span className="flex items-center gap-1 sm:gap-1.5 hidden xs:flex">
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {room._count?.hangouts || 0} hangouts
                            </span>
                            {latestHangout && (
                              <span className="text-[11px] text-gray-400 hidden sm:inline">
                                Latest: {latestHangout.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
