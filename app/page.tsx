import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
            <Image 
              src="/logo.png" 
              alt="HangOut Logo" 
              width={60}
              height={60}
              className="object-contain sm:w-20 sm:h-20"
            />
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold">
              HangOut
            </h1>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-light">
            Plan perfect hangouts with friends
          </p>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-white/90 max-w-2xl mx-auto px-4">
            From choosing restaurants to picking movies, HangOut makes group decisions easy and fun.
            Vote, nominate, and coordinate all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/auth/signup"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-lg text-white rounded-full font-semibold text-base sm:text-lg hover:bg-white/30 transition border border-white/30"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-24 max-w-5xl w-full px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/20">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🍽️</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Restaurant Planning</h3>
            <p className="text-white/80 text-sm sm:text-base">
              Nominate restaurants, vote together, and split the bill fairly
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/20">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎬</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Movie Nights</h3>
            <p className="text-white/80 text-sm sm:text-base">
              Browse movies, see ratings, and vote on what to watch together
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/20 sm:col-span-2 md:col-span-1">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎲</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Game Nights</h3>
            <p className="text-white/80 text-sm sm:text-base">
              Pick board games, plan takeout, and organize the perfect game night
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
