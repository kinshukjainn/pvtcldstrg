import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Insights - Cloudkinshuk",
  description:
    "SEO tips, strategies, and best practices to enhance your online presence and search engine rankings.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
