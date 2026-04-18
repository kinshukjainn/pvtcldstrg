import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Folder Structure - Personal Cloud Storage",
  description:
    "Explore the organized folder structure of your personal cloud storage, designed for easy access and efficient file management. Discover how to navigate and utilize your cloud storage effectively.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
