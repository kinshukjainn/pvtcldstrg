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

const primaryButtonClass =
  "inline-flex w-fit items-center justify-center gap-2 py-2 px-4 font-bold text-[14px] uppercase bg-[#0055cc] text-white border-2 border-t-[#3388ff] border-l-[#3388ff] border-r-[#002266] border-b-[#002266] active:border-t-[#002266] active:border-l-[#002266] active:border-b-[#3388ff] active:border-r-[#3388ff] hover:bg-[#0066ee] transition-none rounded-none";

export default function AboutUs() {
  const links = [
    {
      title: "Portfolio & Projects",
      description:
        "Explore my main website to see my latest work and creations.",
      href: "https://cloudkinshuk.in",
      icon: <FaGlobe className="w-5 h-5 text-[#0055cc]" />,
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: <FaPenNib className="w-5 h-5 text-[#00cc44]" />,
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: <FaCommentDots className="w-5 h-5 text-[#a855f7]" />,
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: <FaMugHot className="w-5 h-5 text-[#dd7700]" />,
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-4 h-4" />,
      href: "https://github.com/cloudkinshuk",
      label: "GitHub",
    },
    {
      icon: <FaTwitter className="w-4 h-4" />,
      href: "https://x.com/realkinshuk004",
      label: "Twitter",
    },
    {
      icon: <FaInstagram className="w-4 h-4" />,
      href: "https://instagram.com/kinshukjainn",
      label: "Instagram",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#dddddd] py-12 px-4 md:px-8  selection:bg-[#0055cc] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ================= PROJECT SECTION ================= */}
        <section className="bg-[#1e1e1e] border border-[#444444] p-6 md:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="p-3 bg-[#000000] border border-[#444444]">
              <BsCloudRain className="w-8 h-8 text-[#dd7700]" />
            </div>
            <div>
              <h1 className="text-[20px] md:text-[24px] font-bold text-white tracking-tight uppercase">
                About Kosha
              </h1>
              <p className="text-[12px] text-[#dd7700] font-bold uppercase tracking-wide">
                Secure Personal Cloud Storage
              </p>
            </div>
          </div>

          <div className="border-t border-[#444444] w-full my-4"></div>

          <p className="text-[13px] md:text-[14px] text-[#aaaaaa] font-bold leading-relaxed mb-6">
            Kosha is a secure, high-performance personal cloud storage platform
            designed to make your digital experience seamless and entirely under
            your control. Say goodbye to restrictive storage limits and hello to
            a private ecosystem built for your files, photos, and documents.
          </p>

          <div className="bg-[#111111] border border-[#444444] p-4 md:p-5">
            <p className="text-[13px] text-[#aaaaaa] font-bold mb-5 leading-relaxed">
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
              className={primaryButtonClass}
            >
              <FaGithub className="w-4 h-4" />
              View Source on GitHub
            </a>
          </div>
        </section>

        {/* ================= DEVELOPER SECTION ================= */}
        <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-[#1e1e1e] border border-[#444444] p-6 md:p-8 shadow-[6px_6px_0px_#000000]">
          {/* Avatar (Sharp edges, hard shadow) */}
          <div className="flex-shrink-0 relative w-28 h-28 md:w-36 md:h-36 border border-[#444444] shadow-[4px_4px_0px_#000000] bg-[#000000]">
            <Image
              src="/profile.jpg" // Replace with your actual image path
              alt="Kinshuk Jain Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 144px"
              priority
            />
          </div>

          {/* Bio & Socials */}
          <div className="space-y-4 w-full">
            <div>
              <h2 className="text-[18px] md:text-[22px] font-bold text-white tracking-tight uppercase">
                Hi, I am Kinshuk Jain
              </h2>
              <p className="text-[12px] text-[#0055cc] font-bold uppercase tracking-wide">
                Lead Developer & Creator
              </p>
            </div>

            <div className="border-t border-[#444444] w-full"></div>

            <p className="text-[13px] md:text-[14px] text-[#aaaaaa] font-bold leading-relaxed">
              I am the lead developer and creator behind Kosha. I specialize in
              building robust tools, platforms, and web applications focused on
              great user experiences and modern architectures. When I am not
              coding, I am writing about tech, exploring new frameworks, or
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
                  className="flex items-center justify-center w-10 h-10 bg-[#000000] text-[#aaaaaa] border border-[#444444] shadow-[2px_2px_0px_#000000] hover:border-[#dd7700] hover:text-[#dd7700] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all duration-150"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RESOURCES & LINKS GRID ================= */}
        <section>
          <div className="flex items-center gap-4 mb-5">
            <h3 className="text-[18px] md:text-[20px] font-bold text-white tracking-tight uppercase">
              More Resources
            </h3>
            <div className="flex-1 border-t border-[#444444]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-5 bg-[#1e1e1e] border border-[#444444] shadow-[4px_4px_0px_#000000] hover:-translate-y-1 hover:border-[#dd7700] hover:shadow-[6px_6px_0px_#000000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all duration-150 rounded-none"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2.5 bg-[#000000] border border-[#444444] group-hover:border-[#dd7700] transition-colors duration-150">
                    {link.icon}
                  </div>
                  <h4 className="text-[15px] font-bold text-white uppercase group-hover:text-[#dd7700] transition-colors">
                    {link.title}
                  </h4>
                </div>
                <p className="text-[#aaaaaa] font-bold text-[13px] leading-relaxed mb-4 flex-1">
                  {link.description}
                </p>

                <div className="mt-auto flex items-center text-[12px] font-bold text-[#555555] uppercase group-hover:text-[#dd7700] transition-colors">
                  Visit Link &rarr;
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="pt-8 border-t border-[#333333] text-center text-[#777777] font-bold text-[11px] uppercase tracking-wide">
          <p>
            COPYRIGHT {new Date().getFullYear()} KINSHUK JAIN. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}
