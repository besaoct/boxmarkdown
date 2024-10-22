import type { Metadata } from "next";
import {Montserrat} from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "next-themes"
import MountWrapper from "@/components/MountWrapper";
import { Toaster } from "@/components/ui/toaster";

const font = Montserrat({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BOXmarkdown",
  description: "BOX markdown. Host your static pages like a pro.",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body
        className={`${font.className} antialiased tabular-nums dark:bg-neutral-900 w-full `}
        cz-shortcut-listen="true"
      >
            <ThemeProvider attribute="class" defaultTheme="dark">
             <MountWrapper>
                {children}
             </MountWrapper>
            </ThemeProvider>
            <Toaster />
      </body>
    </html>
  );
}
