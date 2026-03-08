export default function Header() {
  return (
    // Look at the beginning of className: I added 'relative z-50'
    <header className="relative z-50 w-full bg-[#1e1e1e] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start">
        <h1 className="text-zinc-100 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
          fss.pvt
        </h1>
      </div>
    </header>
  );
}
