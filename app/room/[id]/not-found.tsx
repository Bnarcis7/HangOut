import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-[48px] font-semibold text-gray-900 mb-2">404</h1>
        <h2 className="text-[20px] font-semibold text-gray-900 mb-2">Room Not Found</h2>
        <p className="text-[14px] text-gray-600 mb-8">
          This room doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
