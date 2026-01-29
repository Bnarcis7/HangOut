import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddNominationButton from "./AddNominationButton";
import NominationCard from "./NominationCard";

interface HangoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HangoutPage({ params }: HangoutPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { id: hangoutId } = await params;

  // Get hangout with all related data
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
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      nominations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!hangout) {
    notFound();
  }

  // Check if user is a member of the room
  if (hangout.room.members.length === 0) {
    notFound();
  }

  const typeConfigs = {
    RESTAURANT: {
      emoji: "🍽️",
      label: "Restaurant",
      description: "Find the perfect place to eat",
      nominationLabel: "Restaurant",
    },
    HOME_TAKEOUT: {
      emoji: "🏠",
      label: "Home Takeout",
      description: "Order food to someone's place",
      nominationLabel: "Restaurant/Cuisine",
    },
    HOME_DRINKS: {
      emoji: "🍹",
      label: "Drinks at Home",
      description: "Drinks and snacks at home",
      nominationLabel: "Drink/Snack",
    },
    HOME_GAMES: {
      emoji: "🎲",
      label: "Game Night",
      description: "Board games or party games",
      nominationLabel: "Game",
    },
    MOVIE_NIGHT: {
      emoji: "🎬",
      label: "Movie Night",
      description: "Pick a movie to watch",
      nominationLabel: "Movie",
    },
    GAME_NIGHT: {
      emoji: "🎮",
      label: "Game Night",
      description: "Gaming session",
      nominationLabel: "Game",
    },
    CUSTOM: {
      emoji: "✨",
      label: "Custom",
      description: "Custom hangout type",
      nominationLabel: "Option",
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeConfig = (typeConfigs as any)[hangout.type] || typeConfigs.CUSTOM;

  const statusStylesMap = {
    PLANNING: "bg-blue-50 text-blue-700 border-blue-200",
    VOTING: "bg-purple-50 text-purple-700 border-purple-200",
    DECIDED: "bg-green-50 text-green-700 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
    ARCHIVED: "bg-gray-100 text-gray-500 border-gray-200",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusStyles = (statusStylesMap as any)[hangout.status] || statusStylesMap.PLANNING;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Link
                href={`/room/${hangout.roomId}`}
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight truncate">
                      {hangout.name}
                    </h1>
                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-medium border ${statusStyles} flex-shrink-0`}>
                      <span className="hidden sm:inline">{hangout.status.charAt(0) + hangout.status.slice(1).toLowerCase()}</span>
                      <span className="sm:hidden">{hangout.status.charAt(0)}</span>
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-[13px] text-gray-500 mt-0.5 hidden sm:block">
                    {typeConfig.emoji} {typeConfig.label} · {hangout.room.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Area - Nominations */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Hangout Info */}
            {(hangout.description || hangout.scheduledFor) && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-3">
                {hangout.description && (
                  <div>
                    <p className="text-[13px] sm:text-[14px] text-gray-700">{hangout.description}</p>
                  </div>
                )}
                {hangout.scheduledFor && (
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(hangout.scheduledFor).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Nominations Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
                    Nominations
                  </h2>
                  <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5 hidden sm:block">
                    {typeConfig.description}
                  </p>
                </div>
                <AddNominationButton
                  hangoutId={hangout.id}
                  hangoutType={hangout.type}
                  nominationLabel={typeConfig.nominationLabel}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  <span className="hidden sm:inline">Add {typeConfig.nominationLabel}</span>
                  <span className="sm:inline">Add</span>
                </AddNominationButton>
              </div>

              <div className="p-4 sm:p-6">
                {hangout.nominations.length === 0 ? (
                  <div className="text-center py-10 sm:py-12">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mb-1">
                      No nominations yet
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-gray-500 mb-5 sm:mb-6 px-4">
                      Be the first to suggest a {typeConfig.nominationLabel.toLowerCase()}
                    </p>
                    <AddNominationButton
                      hangoutId={hangout.id}
                      hangoutType={hangout.type}
                      nominationLabel={typeConfig.nominationLabel}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <span className="hidden sm:inline">Add First {typeConfig.nominationLabel}</span>
                      <span className="sm:hidden">Add First</span>
                    </AddNominationButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {hangout.nominations.map((nomination: any) => (
                      <NominationCard
                        key={nomination.id}
                        nomination={nomination}
                        currentUserId={session.user?.id}
                        hangoutType={hangout.type}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Room Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mb-3">
                Room
              </h3>
              <Link
                href={`/room/${hangout.roomId}`}
                className="block text-[13px] text-gray-700 hover:text-gray-900 font-medium"
              >
                {hangout.room.name}
              </Link>
            </div>

            {/* Creator Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mb-3">
                Created By
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] sm:text-[13px] font-semibold text-gray-600">
                    {hangout.creator.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-medium text-gray-900 truncate">
                    {hangout.creator.name}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-gray-500 truncate">
                    {hangout.creator.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
