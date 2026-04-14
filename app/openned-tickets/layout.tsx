import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Openned Tickets - Personal Cloud Storage",
  description:
    "Openned Tickets is a dedicated section within our personal cloud storage platform where users can view and manage their support tickets. This feature allows users to easily track the status of their inquiries, receive updates from our support team, and ensure that their issues are addressed in a timely manner.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
