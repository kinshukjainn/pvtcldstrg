import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Tiers - Personal Cloud Storage",
  description:
    "Explore our flexible pricing tiers designed to meet your personal cloud storage needs. Whether you're looking for a free option or need more storage and features, we have a plan that's right for you. Compare our plans and choose the one that best fits your requirements.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
