import Image from "next/image";
import {
  FaGlobe,
  FaPenNib,
  FaCommentDots,
  FaMugHot,
  FaGithub,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { BsCloudRain } from "react-icons/bs";

export default function AboutUs() {
  const links = [
    {
      title: "Portfolio & Projects",
      description:
        "Explore my main website to see my latest work and creations.",
      href: "https://cloudkinshuk.in",
      icon: <FaGlobe className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: <FaPenNib className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: <FaCommentDots className="w-6 h-6 text-purple-400" />,
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep the servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: <FaMugHot className="w-6 h-6 text-[#ff9100]" />,
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: "https://github.com/cloudkinshuk",
      label: "GitHub",
    },
    {
      icon: <FaTwitter className="w-5 h-5" />,
      href: "https://x.com/realkinshuk004",
      label: "Twitter",
    },
    {
      icon: <FaInstagram className="w-5 h-5" />,
      href: "https://instagram.com/kinshukjainn",
      label: "Instagram",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-neutral-200 py-16 px-6 ">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* ================= PROJECT SECTION ================= */}
        <section className="space-y-6 bg-white/[0.03] border border-white/[0.08] p-8 md:p-10 rounded-lg shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#1e1e1e] rounded-full border border-white/[0.08] shadow-sm">
              <BsCloudRain className="w-8 h-8 text-[#ff9100]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              About Kosha
            </h1>
          </div>

          <p className="text-lg text-neutral-300 leading-relaxed">
            Kosha is a secure, high-performance personal cloud storage platform
            designed to make your digital experience seamless and entirely under
            your control. Say goodbye to restrictive storage limits and hello to
            a private ecosystem built for your files, photos, and documents.
          </p>

          <div className="pt-4 border-t border-white/[0.08]">
            <p className="text-neutral-400 mb-4 leading-relaxed">
              <strong className="text-neutral-200 font-semibold">
                Proudly Open Source:
              </strong>{" "}
              Kosha is built with transparency in mind. The core project is
              open-source, meaning developers can self-host, audit the code, and
              contribute to its continuous improvement.
            </p>
            <a
              href="https://github.com/cloudkinshuk/kosha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#2a2a2a] hover:bg-[#333333] border border-white/[0.12] text-white rounded-lg font-medium transition-colors duration-200"
            >
              <FaGithub className="w-5 h-5" />
              View Source on GitHub
            </a>
          </div>
        </section>

        {/* ================= DEVELOPER SECTION ================= */}
        <section className="flex flex-col md:flex-row gap-8 items-start bg-white/[0.03] border border-white/[0.08] p-8 md:p-10 rounded-lg shadow-lg">
          {/* Avatar */}
          <div className="flex-shrink-0 relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/profile.jpg" // Replace with your actual image path
              alt="Kinshuk Jain Avatar"
              fill
              className="object-cover rounded-full border border-white/[0.12] shadow-md"
              sizes="(max-width: 768px) 128px, 160px"
              priority
            />
          </div>

          {/* Bio & Socials */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Hi, I&apos;m Kinshuk Jain
            </h2>
            <p className="text-base text-neutral-300 leading-relaxed">
              I am the lead developer and creator behind Kosha. I specialize in
              building robust tools, platforms, and web applications focused on
              great user experiences and modern architectures. When I&apos;m not
              coding, I&apos;m writing about tech, exploring new frameworks, or
              looking for ways to improve the digital tools we use every day.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 bg-[#1e1e1e] border border-white/[0.08] rounded-lg text-neutral-400 hover:text-white hover:bg-[#2a2a2a] hover:border-white/[0.2] transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RESOURCES & LINKS GRID ================= */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
            More Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 bg-white/[0.03] border border-white/[0.08] rounded-lg hover:bg-white/[0.06] hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#1e1e1e] rounded-lg border border-white/[0.08] group-hover:scale-105 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-200 group-hover:text-white transition-colors">
                    {link.title}
                  </h4>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  {link.description}
                </p>

                <div className="mt-auto flex items-center text-sm font-medium text-neutral-500 group-hover:text-blue-400 transition-colors">
                  Visit Link
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="pt-8 border-t border-white/[0.08] text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} Kinshuk Jain. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
