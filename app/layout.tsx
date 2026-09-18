import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RareHandle — Find Rare Instagram Usernames",
  description: "Discover short, clean and brandable Instagram usernames and verify availability.",
  openGraph: { title: "RareHandle", description: "Find rare Instagram usernames.", type: "website" },
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
