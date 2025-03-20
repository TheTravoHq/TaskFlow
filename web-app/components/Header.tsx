import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"
          >
            TaskFlow
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/projects"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              Projects
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
          <Link
            href="/profile"
            className="rounded-full h-8 w-8 bg-gray-800 hover:bg-gray-700 flex items-center justify-center border border-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
