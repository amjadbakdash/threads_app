import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import TopSidebar from "@/component/shared/TopSidebar";
import LeftSidebar from "@/component/shared/LeftSidebar";
import RightSidebar from "@/component/shared/RightSidebar";
import BottomBar from "@/component/shared/BottomBar";


export const metadata:
  Metadata = {
  title: "Threads",
  description: "A Next.js 15 Meta Threads Application"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>

          <TopSidebar />

          <main className="flex ">

            <LeftSidebar />

            <section className="main-container">

              <div className="w-full max-w-4xl ">
                {children}
              </div>

            </section>

            <RightSidebar />

          </main>

          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
