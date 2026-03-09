import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-50 w-full bg-[#1e1e1e] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <h1 className="text-zinc-100 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
            fss.pvt
          </h1>
        </Link>

        <nav>
          <Link
            href="/supported-formats"
            className="text-sm sm:text-base text-zinc-300 hover:text-white transition-colors font-medium"
          >
            Supported Formats
          </Link>
        </nav>
      </div>
    </header>
  );
}
