"use client";
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
      icon: <FaGlobe className="w-6 h-6 text-[#0088ff]" />,
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: <FaPenNib className="w-6 h-6 text-[#00cc44]" />,
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: <FaCommentDots className="w-6 h-6 text-[#a855f7]" />,
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep the servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: <FaMugHot className="w-6 h-6 text-[#ff9900]" />,
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-6 h-6" />,
      href: "https://github.com/cloudkinshuk",
      label: "GitHub",
    },
    {
      icon: <FaTwitter className="w-6 h-6" />,
      href: "https://x.com/realkinshuk004",
      label: "Twitter",
    },
    {
      icon: <FaInstagram className="w-6 h-6" />,
      href: "https://instagram.com/kinshukjainn",
      label: "Instagram",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#dddddd] py-16 px-6 font-sans selection:bg-[#ff9900] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* ================= PROJECT SECTION ================= */}
        <section className="bg-[#1e1e1e] border-4 border-[#000000] p-8 md:p-10 shadow-[8px_8px_0px_#000000]">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-3 bg-[#000000] border-2 border-[#444444]">
              <BsCloudRain className="w-8 h-8 text-[#ff9900]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
              About Kosha
            </h1>
          </div>

          <p className="text-[16px] md:text-lg text-[#aaaaaa] font-bold leading-relaxed mb-6">
            Kosha is a secure, high-performance personal cloud storage platform
            designed to make your digital experience seamless and entirely under
            your control. Say goodbye to restrictive storage limits and hello to
            a private ecosystem built for your files, photos, and documents.
          </p>

          <div className="pt-6 border-t-4 border-[#000000]">
            <p className="text-[#aaaaaa] font-bold mb-6 leading-relaxed">
              <strong className="text-white uppercase tracking-wide">
                Proudly Open Source
              </strong>{" "}
              — Kosha is built with transparency in mind. The core project is
              open-source, meaning developers can self-host, audit the code, and
              contribute to its continuous improvement.
            </p>
            <a
              href="https://github.com/cloudkinshuk/kosha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#ffffff] text-black border-2 border-[#000000] font-bold uppercase shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150"
            >
              <FaGithub className="w-5 h-5" />
              View Source on GitHub
            </a>
          </div>
        </section>

        {/* ================= DEVELOPER SECTION ================= */}
        <section className="flex flex-col md:flex-row gap-8 items-start bg-[#1e1e1e] border-4 border-[#000000] p-8 md:p-10 shadow-[8px_8px_0px_#000000]">
          {/* Avatar (Sharp edges, hard shadow) */}
          <div className="flex-shrink-0 relative w-32 h-32 md:w-40 md:h-40 border-4 border-[#000000] shadow-[6px_6px_0px_#000000] bg-[#000000]">
            <Image
              src="/profile.jpg" // Replace with your actual image path
              alt="Kinshuk Jain Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 160px"
              priority
            />
          </div>

          {/* Bio & Socials */}
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
              Hi, I am Kinshuk Jain
            </h2>
            <p className="text-[16px] text-[#aaaaaa] font-bold leading-relaxed">
              I am the lead developer and creator behind Kosha. I specialize in
              building robust tools, platforms, and web applications focused on
              great user experiences and modern architectures. When I am not
              coding, I am writing about tech, exploring new frameworks, or
              looking for ways to improve the digital tools we use every day.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 bg-[#000000] text-white border-2 border-[#444444] shadow-[4px_4px_0px_#000000] hover:border-[#ff9900] hover:text-[#ff9900] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RESOURCES & LINKS GRID ================= */}
        <section>
          <h3 className="text-2xl font-bold text-white mb-6 tracking-tight uppercase">
            More Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 bg-[#1e1e1e] border-2 border-[#444444] shadow-[6px_6px_0px_#000000] hover:-translate-y-1 hover:border-[#ff9900] hover:shadow-[8px_8px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#000000] border-2 border-[#444444] group-hover:border-[#ff9900] transition-colors duration-150">
                    {link.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase group-hover:text-[#ff9900] transition-colors">
                    {link.title}
                  </h4>
                </div>
                <p className="text-[#aaaaaa] font-bold text-[15px] leading-relaxed mb-6">
                  {link.description}
                </p>

                <div className="mt-auto flex items-center text-[14px] font-bold text-[#dddddd] uppercase group-hover:text-[#ff9900] transition-colors">
                  Visit Link
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="pt-8 border-t-4 border-[#333333] text-center text-[#888888] font-bold text-[14px] uppercase tracking-wide">
          <p>
            COPYRIGHT {new Date().getFullYear()} KINSHUK JAIN. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}
