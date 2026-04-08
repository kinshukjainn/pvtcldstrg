import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Personal Cloud Storage",
  description:
    "Learn about the terms and conditions of  our personal cloud storage solution.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
