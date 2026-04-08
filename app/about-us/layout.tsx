import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Personal Cloud Storage",
  description:
    "Learn more about our personal cloud storage solution and how we can help you keep your data organized and secure.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
