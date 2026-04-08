import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Personal Cloud Storage",
  description:
    "Learn about the privacy practices of our personal cloud storage solution.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
