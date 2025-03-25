export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[40px] row-start-2 items-center text-center">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-indigo-700">
              TaskFlow
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
              Your all-in-one solution for seamless task management. Stay
              organized, boost productivity, and achieve more with our intuitive
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-8 items-center">
            <ul className="text-left space-y-4 text-gray-700">
              {[
                'Progress tracking',
                'Task management',
                'Everything automatic',
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 transform hover:translate-x-1 transition-transform duration-200"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                    ✓
                  </span>
                  <span className="text-lg font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/auth"
              className="group relative px-8 py-3 w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
            </a>
          </div>
        </main>

        <footer className="row-start-3 text-sm font-medium text-gray-700 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm">
          <p>Streamline your workflow today</p>
        </footer>
      </div>
    </div>
  );
}
