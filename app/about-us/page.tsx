import { FaGlobe, FaPenNib, FaCommentDots, FaMugHot } from "react-icons/fa";
import { BsCloudRain } from "react-icons/bs";

export default function AboutUs() {
  const links = [
    {
      title: "Portfolio & Projects",
      description:
        "Explore my main website to see my latest work and creations.",
      href: "https://cloudkinshuk.in",
      icon: <FaGlobe className="w-6 h-6 text-blue-400" />,
      delay: "animate-fade-in-up delay-100",
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: <FaPenNib className="w-6 h-6 text-emerald-400" />,
      delay: "animate-fade-in-up delay-200",
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: <FaCommentDots className="w-6 h-6 text-purple-400" />,
      delay: "animate-fade-in-up delay-300",
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep the servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: <FaMugHot className="w-6 h-6 text-[#ff9100]" />,
      delay: "animate-fade-in-up delay-400",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-20 px-6 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-zinc-900/50 rounded-full border border-zinc-800/50 mb-4 shadow-xl">
            <BsCloudRain className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Hi, I&apos;m{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Kinshuk Jain
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            I&apos;m the developer behind WoolyCloud. I build tools and
            platforms designed to make your digital experience seamless. Connect
            with me, read my thoughts, or help support the project below.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-6 bg-zinc-900/40 border border-zinc-800 rounded-4xl hover:bg-zinc-800/50 hover:border-2 hover:border-blue-700 hover:shadow-md hover:shadow-blue-700 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient effect inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-zinc-950 rounded-full border border-zinc-800 group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
                <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                  {link.title}
                </h2>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {link.description}
              </p>

              <div className="mt-auto pt-6 flex items-center text-sm font-medium text-zinc-500 group-hover:text-blue-400 transition-colors">
                Visit Link
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} Kinshuk Jain. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
