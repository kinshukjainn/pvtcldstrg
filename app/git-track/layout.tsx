import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Git Track - Personal Cloud Storage",
  description:
    "Git Track is a powerful tool that allows you to seamlessly integrate your GitHub repositories with your personal cloud storage. With Git Track, you can easily track changes, manage your code, and keep your projects organized in one convenient location.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
