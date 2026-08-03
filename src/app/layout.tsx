import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Wayfarer Hub - Travel Itinerary Planner & Community Map",
  description: "Plan trips, log places, view interactive maps, and collaborate with travel companions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
