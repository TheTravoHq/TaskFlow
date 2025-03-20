export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          TaskFlow
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Your all-in-one solution for seamless task management. Stay organized,
          boost productivity, and achieve more with our intuitive platform.
        </p>

        <div className="flex flex-col gap-6 items-center">
          <ul className="text-left space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Progress tracking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Task management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Everything automatic
            </li>
          </ul>

          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-base h-12 px-8 w-full sm:w-auto"
            href="/auth"
          >
            Get Started →
          </a>
        </div>
      </main>

      <footer className="row-start-3 text-sm text-gray-500">
        <p>Streamline your workflow today</p>
      </footer>
    </div>
  );
}
