import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <Image 
                src="/logo.png" 
                alt="HangOut Logo" 
                width={24}
                height={24}
                className="object-contain"
              />
              <h1 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight">
                Profile Settings
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 mb-2">
            Your Profile
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500 mb-8">
            Manage your profile information and avatar
          </p>

          <ProfileForm user={session.user} />
        </div>
      </main>
    </div>
  );
}
