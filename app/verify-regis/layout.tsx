import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Registration - Personal Cloud Storage",
  description:
    "Verify your registration for our personal cloud storage solution and access your account.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
